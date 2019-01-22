import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
 import * as SavitzkyGolay from 'ml-savitzky-golay';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TgaRunService } from '../services/tga-run.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-tga-peak-selection-tool',
  templateUrl: './tga-peak-selection-tool.component.html',
  styleUrls: ['./tga-peak-selection-tool.component.css']
})
export class TgaPeakSelectionToolComponent implements OnInit {

  TgaFileList = [];
  selectedFileIndex = 1;
  selectedFile;
  TgaRun;
  updateFlag;

  firstRunLoaded = false;
  renderChart = false;
  Highcharts = Highcharts;
  chartOptions = {
    chart: {

      zoomType: 'xy',
    },
    series: [],
    title: {
      text: '',
    },
    yAxis: [
      {
      title: {
        text: 'd(%) / d(c)'
      }
    },
    {
      title: {
        text: 'Weight Percent'
      },
      opposite: true,
    },
    // {
    //   title:{
    //     text: 'Mass'
    //   }
    // }
  ],
  xAxis: [
    {
      plotLines: [],
     // min: 100,
     // max: 1100,
    }
  ]

  };

  xAxisTypes = ['temperature', 'minutes', 'mass', 'weight_percent'];
  yAxisTypes = ['temperature', 'minutes', 'mass', 'weight_percent'];

  peakColumns = [];

 sgOptions;

  constructor(public http: HttpClient, public notification: NotificationsService) { }

  ngOnInit() {

    this.fetchFileList();

  }

  recalculateDerivative () {

    // this.sgOptions.windowSize = 5;
    this.notification.info('Processing', 'Window Size: ' + this.sgOptions.windowSize + ', Polynomial: ' + this.sgOptions.polynomial, {timeOut: 2000, showProgressBar: false, clickToClose: true});

    try {
      let xArray = [];
      let yArray = [];
      // get data in question
      this.TgaRun.steps.forEach((step, index) => {

        if (step.name === 'Ramp 20.00 °C/min to 1000.00 °C' || step.name === 'Ramp 50.00 °C/min to 1000.00 °C') {

          step.data.forEach((point, i) => {
            xArray.push(point.temperature);
            yArray.push(point.weight_percent);

          });
        }

      });


      // Smoothing
      const options = {derivative: 0, pad: 'post', padValue: 'replicate', };
                     xArray = SavitzkyGolay(xArray, 0, options);
                     yArray = SavitzkyGolay(yArray, 0, options);

      // console.log(xArray,yArray);

      const dX = SavitzkyGolay(xArray, 1, this.sgOptions);
      const dY = SavitzkyGolay(yArray, 1, this.sgOptions);

      const newData = [];

      this.chartOptions.series[1].data.forEach((o, i) => {

        const point = {
          y: dY[i] / dX[i],
          x: o.x,
        };
        newData.push(point);
      //  console.log(o);

      });

      console.log( this.chartOptions);
      this.chartOptions.series[1].data = newData;
      this.updateFlag = true; // update the graph
    } catch (e) {
      this.notification.error('Error', e, {timeOut: 4000, showProgressBar: false, clickToClose: true});

    }
  }

  chartRender() {


  }

  fetchFileList () {
    this.http.get<any>(environment.apiUrl + `/tga/filelist`)
    .subscribe(items => {
            console.log(items);

            this.TgaFileList = items;
            if (!this.firstRunLoaded) {
              this.selectedFile = this.TgaFileList[this.selectedFileIndex];
              this.fetchTgaRun(this.TgaFileList[this.selectedFileIndex].name);
              this.firstRunLoaded = true;
            }
        });
  }

  fetchTgaRun (runName) {

    this.http.get<any>(environment.apiUrl + `/tga/` + runName)
    .subscribe(obj => {
            console.log(obj);

            this.TgaRun = obj;

            this.updateHighchartObj();
        });

  }

  updateHighchartObj() {


    // this.renderChart = false;
    this.chartOptions.series = [];
    this.chartOptions.xAxis[0].plotLines = [];

    this.chartOptions.title.text = this.TgaRun.Procedure.comments;



    /// Testing this series type

    this.TgaRun.steps.forEach((step, i) => {

      if (step.name === 'Ramp 20.00 °C/min to 1000.00 °C' || step.name === 'Ramp 50.00 °C/min to 1000.00 °C') {

        console.log(step);

          /// Derivative
          const seriesObj = {

            name: 'd(%) / d(C) - ' + this.TgaRun.filename,
            type: 'spline',
            yAxis: 0,
            turboThreshold: 0,
            data: [],
            events: {
              click: (x) => {

              this.createTgaRunPeak(x.point);
            }
           }
          };

          const wtPercent = {

            name: 'Weight Percent',
            type: 'spline',
            dashStyle: 'DashDot',
            data_type: 'derivative',
            yAxis: 1,
            data: [],
            turboThreshold: 0,
            events: {
              click: (x) => {

              this.createTgaRunPeak(x.point);
            }
           }
          };


          this.TgaRun.steps[i].data.forEach((point) => {

            const newPoint = {x: null, y: null};
            const newPoint2 = {x: null, y: null};

            newPoint.x = parseFloat(point.temperature);
            newPoint.y = parseFloat(point['% / C']);

            seriesObj.data.push(newPoint);

            newPoint2.x = parseFloat(point.temperature);
            newPoint2.y = parseFloat(point.weight_percent);

            wtPercent.data.push(newPoint2);

          });

          this.chartOptions.series.push(wtPercent);
          this.chartOptions.series.push(seriesObj);


          //
      }

    });

    if (this.TgaRun.peaks[0]) {
      this.TgaRun.peaks.forEach((peak, index) => {
        const plotline = {
          value: peak.temperature,
        };
        this.chartOptions.xAxis[0].plotLines.push(plotline);
      });
    }

    this.sgOptions = {

      polynomial: 2,
      windowSize: 105,
      derivative: 1,
      pad: 'post',
      padValue: 'replicate',
    };

    this.updateFlag = true;
    this.renderChart = true;

    console.log(this.chartOptions);

  }

  createTgaRunPeak(obj) {

    console.log(obj);

    const peak = {


      temperature: obj.x,
      value: obj.y,
      tga_run: this.TgaRun.filename,

    };

    this.http.post<any>(environment.apiUrl + `/tga/peak/derivative/weight-temperature?filterSpinner`, peak)
    .subscribe((response) => {
            console.log(response);
            this.TgaRun.peaks.push(response);
            this.notification.success('Created', 'Seems good.', {timeOut: 2000, showProgressBar: false, clickToClose: true});

            const plotline = {
              value: peak.temperature,
            };

            this.chartOptions.xAxis[0].plotLines.push(plotline);
            this.updateFlag = true;

        });
  }

  deleteTgaRunPeak (peak) {
    console.log(peak);
    this.http.delete<any>(environment.apiUrl + `/tga/peak/derivative/weight-temperature/` + peak.id + '?filterSpinner')
    .subscribe((r) => {
                let testPeak = false;
               this.TgaRun.peaks.forEach((peak2, index) => {
                if (peak.id === peak2.id) {
                   this.TgaRun.peaks.splice(index, 1);
                  this.notification.success('We did it.', 'The peak was destroyed.', {timeOut: 2000, showProgressBar: false, clickToClose: true});
                  testPeak = true;
                }
              });
              if (testPeak) {
              this.chartOptions.xAxis[0].plotLines.forEach((plotline, index) => {

                if (plotline.value === peak.temperature) {
                  this.chartOptions.xAxis[0].plotLines.splice(index, 1);

                }
              });
              this.updateFlag = true;
            }
        });
  }

  previousRun() {
    this.selectedFileIndex = this.selectedFileIndex - 1;
    this.selectedFile = this.TgaFileList[this.selectedFileIndex];
    this.fetchTgaRun(this.TgaFileList[this.selectedFileIndex].name);
  }

  nextRun() {
    this.selectedFileIndex = this.selectedFileIndex + 1;
    this.selectedFile = this.TgaFileList[this.selectedFileIndex];
    this.fetchTgaRun(this.TgaFileList[this.selectedFileIndex].name);
  }

  changeSelectedFile(event) {
    // console.log(selectedFile);
    this.selectedFile = event.value;
    this.fetchTgaRun(this.selectedFile.name);
  }

}

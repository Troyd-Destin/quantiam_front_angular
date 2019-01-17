import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
//import * as SG from '../../../assets/js/savitzky-golay';

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
    chart:{

      zoomType: 'xy',
    },
    series: [],
    title:{
      text: '',
    },
    yAxis:[
      {
      title:{
        text: 'd(%) / d(c)'
      }
    },
    {
      title:{
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
  xAxis:[
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

  constructor(public http: HttpClient, public notification: NotificationsService) { }

  ngOnInit() {

    this.fetchFileList();
  //  console.log(Object.getOwnPropertyNames(SG));
   //// console.log(module.exports);
   
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

    //this.renderChart = false;
    this.chartOptions.series = [];

    this.chartOptions.title.text = this.TgaRun.Procedure.comments;
      


    /// Testing this series type

    this.TgaRun.steps.forEach((step,i)=>{

      if(step.name == 'Ramp 20.00 °C/min to 1000.00 °C' || step.name == 'Ramp 50.00 °C/min to 1000.00 °C'){

        console.log(step);

          /// Derivative 
          let seriesObj = {

            name: 'd(%) / d(C)',
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
          
          let wtPercent = {

            name: 'Weight Percent',
            type: 'spline',
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
      
            let newPoint = {x: null, y: null};
            let newPoint2 = {x: null, y: null};

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

    })

    if(this.TgaRun.peaks[0])
    {
      this.TgaRun.peaks.forEach((peak,index)=>{
        let plotline = {
          value: peak.temperature,
        };
        this.chartOptions.xAxis[0].plotLines.push(plotline);
      })
    }

    this.updateFlag = true;
    this.renderChart = true;

    console.log(this.chartOptions);

  }

  createTgaRunPeak(obj) {

    console.log(obj);

    let peak = {


      temperature: obj.x,
      value: obj.y,
      tga_run: this.TgaRun.filename, 

    };

    this.http.post<any>(environment.apiUrl + `/tga/peak/derivative/weight-temperature?filterSpinner`,peak)
    .subscribe(obj => {
            console.log(obj);
            this.TgaRun.peaks.push(obj);
            this.notification.success('Created', 'Seems good.', {timeOut: 2000, showProgressBar: false, clickToClose: true});

            let plotline = {
              value: peak.temperature,
            };

            this.chartOptions.xAxis[0].plotLines.push(plotline);
            this.updateFlag = true;

        });
  }

  deleteTgaRunPeak (peak)
  {
    console.log(peak);
    this.http.delete<any>(environment.apiUrl + `/tga/peak/derivative/weight-temperature/`+peak.id+'?filterSpinner')
    .subscribe((r) => {
                let testPeak = false;
               this.TgaRun.peaks.forEach((peak2,index)=>{
                if(peak.id == peak2.id)
                {
                   this.TgaRun.peaks.splice(index,1);
                  this.notification.success('We did it.', 'The peak was destroyed.', {timeOut: 2000, showProgressBar: false, clickToClose: true});
                  testPeak = true;
                }
              });
              if (testPeak){
              this.chartOptions.xAxis[0].plotLines.forEach((plotline,index)=>{

                if(plotline.value === peak.temperature)
                {
                  this.chartOptions.xAxis[0].plotLines.splice(index,1);

                }
              })
              this.updateFlag = true;
            }
        });
  }

  previousRun()
  {
    this.selectedFileIndex = this.selectedFileIndex - 1;
    this.selectedFile = this.TgaFileList[this.selectedFileIndex];
    this.fetchTgaRun(this.TgaFileList[this.selectedFileIndex].name);
  }

  nextRun()
  {
    this.selectedFileIndex = this.selectedFileIndex + 1;
    this.selectedFile = this.TgaFileList[this.selectedFileIndex];
    this.fetchTgaRun(this.TgaFileList[this.selectedFileIndex].name);
  }

  changeSelectedFile(event)
  {
    //console.log(selectedFile);
    this.selectedFile = event.value;
    this.fetchTgaRun(this.selectedFile.name);
  }

}

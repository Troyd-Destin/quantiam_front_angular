import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

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

  firstRunLoaded = false;
  renderChart = false;
  Highcharts = Highcharts;
  chartOptions = {
    series: [],
    title:{
      text: '',
    }


  };

  xAxisTypes = ['temperature', 'minutes', 'mass', 'weight_percent'];
  yAxisTypes = ['temperature', 'minutes', 'mass', 'weight_percent'];

  peakColumns = [];

  constructor(public http: HttpClient, public notification: NotificationsService) { }

  ngOnInit() {

    this.fetchFileList();
   
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

    this.renderChart = false;
    this.chartOptions.series = [];

    this.chartOptions.title.text = this.TgaRun.Procedure.comments;
      


    /// Testing this series type

    this.TgaRun.steps.forEach((step,i)=>{

      if(step.name == 'Ramp 20.00 °C/min to 1000.00 °C' || step.name == 'Ramp 50.00 °C/min to 1000.00 °C'){

        console.log(step);


          this.TgaRun.steps[i].type = 'spline';
          this.TgaRun.steps[i].events = {};
      
          this.TgaRun.steps[i].turboThreshold = 0;

          this.TgaRun.steps[i].data.forEach((point) => {
      
            point.x = parseFloat(point.temperature);
            point.y = parseFloat(point['Smoothed']);
      
          });
      
          this.TgaRun.steps[i].events.click = (x) => {
      
            this.createTgaRunPeak(x.point);
          };
    
          this.chartOptions.series.push(this.TgaRun.steps[i]);
      }

    })

    



   

    console.log(this.chartOptions);

    setTimeout((x) => { this.renderChart = true; }, 200);
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
        });
  }

  deleteTgaRunPeak (peak)
  {
    console.log(peak);
    this.http.delete<any>(environment.apiUrl + `/tga/peak/derivative/weight-temperature/`+peak.id+'?filterSpinner')
    .subscribe((r) => {
               this.TgaRun.peaks.forEach((peak2,index)=>{
                if(peak.id == peak2.id)
                {
                   this.TgaRun.peaks.splice(index,1);
                  this.notification.success('We did it.', 'The peak was destroyed.', {timeOut: 2000, showProgressBar: false, clickToClose: true});
                }
              });
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

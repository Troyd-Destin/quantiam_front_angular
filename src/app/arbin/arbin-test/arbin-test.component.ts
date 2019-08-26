import { Component, OnInit } from '@angular/core';

import {  HttpClient} from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_boost from 'highcharts/modules/boost';

HC_exporting(Highcharts);
HC_boost(Highcharts);

@Component({
  selector: 'app-arbin-test',
  templateUrl: './arbin-test.component.html',
  styleUrls: ['./arbin-test.component.css']
})
export class ArbinTestComponent implements OnInit {

  constructor( private http: HttpClient,private route: ActivatedRoute,) { }

  testData:any = [];

  Highcharts = Highcharts;
  chart: any; // Chart Instance
  updateFlag;
  oneToOneFlag = true;

  currentXField = 'Current';
  currentYField = 'Voltage';
  fields = ['Charge_Capacity','Discharge_Capacity',
  'Charge_Energy','Test_Time','Step_Time','Data_Point','Channel_ID','Date_Time','Current','Voltage'];

  HighchartOptions: any = {
    chart: { zoomType: 'xy', panning: true, panKey: 'shift'},
    title: { text: '' },
    credits:{text: 'Quantiam Technologies', href:''},
    subtitle: { text: ''},
    series: [],
    xAxis: [{
      gridLineWidth: 0,

      minorGridLineWidth: 0,
      title:{ text: ''}
    }],
    yAxis: [{
        maxPadding: 0.25,
       tickLength: 0,
       floor: 0,
      // gridLineColor: "#e6e6e600",
      // tickColor: "#e6e6e600",
      // minorGridLineColor: "#e6e6e600",
      title: {
        text: '',
      } 
    }],
    legend: {
      labelFormatter: function() {
        if (this.userOptions.formula) {
          return this.userOptions.formula;
        }

        if (this.name.length > 25) {
        return this.name.slice(0, 25) + '...';
        }
        return this.name;
    }
    },
    hcCallback: (chart: Highcharts.Chart) => {
      console.log('some variables: ', Highcharts, chart);
    }
  };

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.fetchTestData(params.get('id'));
    });
  }


  fetchTestData(id)
  {
    this.http.get('http://localhost:3000/arbin/test/'+id).subscribe((r:any) => {

        let serie:any = {};
        serie.type = 'scatter';

        r.forEach((element) => {

            element.x = element[this.currentXField];
            element.y = element[this.currentYField];
          
          
        });

        this.HighchartOptions.xAxis[0].title.text = this.currentXField;
        this.HighchartOptions.yAxis[0].title.text = this.currentYField;


        serie.data = r;
        serie.boostThreshold = 1;
        // serie.keys = ['name','test','test','y', 'test','test', 'test', 'test','test','test','x'];
        serie.turboThreshold = 0;
        serie.marker = {};
        serie.marker.radius = 1;
        console.log(serie);



        this.HighchartOptions.series.push(serie);
        
         this.updateFlag = true;
    }, error => { 

      console.log(error);
    });
  }

  chartCallback(){

  }

  changeAxis(){


  }

  changeFields() 
  {
    this.HighchartOptions.series.forEach(series => {
      
          series.data.forEach(dataPoint => {

            dataPoint.x = dataPoint[this.currentXField];
            dataPoint.y = dataPoint[this.currentYField];
            
          });
      
    });

    this.HighchartOptions.xAxis[0].title.text = this.currentXField;
    this.HighchartOptions.yAxis[0].title.text = this.currentYField;

    this.updateFlag = true;
  }

}

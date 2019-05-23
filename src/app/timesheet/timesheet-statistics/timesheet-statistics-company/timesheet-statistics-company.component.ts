import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


import { HotTableRegisterer } from '@handsontable/angular';


import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

@Component({
    selector: 'app-timesheet-statistics-company',
    templateUrl: './timesheet-statistics-company.component.html',
    styleUrls: ['./timesheet-statistics-company.component.css']
})
export class TimesheetStatisticsCompanyComponent implements OnInit {

    currentYear = new Date().getFullYear();
    selectedYear = this.currentYear;
    yearList = [];

    renderChart = true;
    renderYearlyChart = false;
    renderStackedMontlyChart = false;
    Highcharts = Highcharts;


    yearlyChartOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Hours By Category'
        },
        subtitle: {
            text: 'Quantiam Technologies, ' + this.selectedYear
        },
        tooltip: {
            pointFormat: '{point.y} Hours, <b>{point.percentage:.1f}%</b>'
        },

        series: [{
            name: 'Categories',
            colorByPoint: true,
            data: [],
        }]

    };

    allMonthlyStackedChartOptions: any = {
        chart: {

            type: "area"
        },
        title: {

            text: "Percentage of All Time Monthly Hours by Category "

        },
        subtitle: {
            text: 'Quantiam Technologies Inc. 2015 to '+ this.currentYear,
        },
        yAxis: {
            title: {
                text: 'Percent'
            }
        },
        xAxis: {
          //categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} hours)<br/>',
        split: true
    },
      plotOptions: {
        area: {
            stacking: 'percent',
            lineColor: '#ffffff',
            lineWidth: 1,
            marker: {
                lineWidth: 0,
                enabled: false,
                lineColor: '#ffffff'
            }
       
        }
      }
    };
    allTimePercentageChartOptions: any = {};
    updateFlag;
    updateFlag2;

    yearlyDataParams: any = { quarter: undefined, absence: true };


    yearlyResponseObj: any;
    allMonthlyResponseObj: any;

    private hotRegisterer = new HotTableRegisterer();
    id = 'hotInstance2';
    hotTableSettings: any = {
        // colHeaders: true,
        // colHeaders: false,
    };



    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.createYearSelection();
        this.getYearlyChartData();
        this.getAllTimePercentageData();

    }


    chartRender() {


    }


    getYearlyChartData() {

        console.log(this.yearlyDataParams);

        this.http.get(environment.apiUrl + '/timesheet/statistics/year/' + this.selectedYear + '/category/aggregate', { params: this.yearlyDataParams }).subscribe((r: any) => {

            this.yearlyResponseObj = r;
            this.yearlyChartOptions.series[0].data = r.data;
            this.yearlyChartOptions.title.text = 'Quantiam Technologies, ' + this.selectedYear;
            setTimeout((x) => {
                this.hotRegisterer.getInstance(this.id).loadData(r.data);
                this.renderYearlyChart = true;
            }, 100);


            this.updateFlag = true;


        });


    }


    getAllTimePercentageData() {


        this.http.get(environment.apiUrl + '/timesheet/statistics/all/monthly-hours').subscribe((r: any) => {

            this.allMonthlyResponseObj = r;
            this.allMonthlyStackedChartOptions.series = r.monthlyTotalByCategory;
            this.allMonthlyStackedChartOptions.xAxis.categories = r.monthList;
           // this.allMonthlyStackedChartOptions.title.text = 'Quantiam Technologies, ' + this.selectedYear;
           setTimeout((x) => {
            
            this.renderStackedMontlyChart = true;

        }, 100);
          
            this.updateFlag2 = true;

            console.log(this.allMonthlyStackedChartOptions);

        });


    }



    createYearSelection() {
        let i;
        const startingYear = 2015;
        const currentYear = new Date().getFullYear();
        for (i = startingYear; i <= currentYear; i++) {
            this.yearList.push(i);
        }
    }

}
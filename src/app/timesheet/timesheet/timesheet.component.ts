import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {  environment} from '../../../environments/environment';

import {  HttpClient} from '@angular/common/http';

import * as moment from 'moment';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  private gridApi;
  private gridColumnApi;


  private rowData = [];

  timeSheetObj;
  timeSheetFramework = [];

  displayTimesheet = false;

  routeParams = {
    userId: null,
    year: null,
    payperiod: null,
  };

  defaultColDef = {
    resizable: true,
  };

  autoGroupColumnDef = {
    headerName: 'Category',
    lockPosition: true,
    width: 400,
    suppressMenu: true,
    lockPinned: true,
    pinned: 'left',
    sortable: true,
    field: 'project.description',


    cellRendererParams: {
      suppressCount: true,
     // checkbox: true,
      padding: 20,
      cellStyle:
      {
        'font-size': '12px',
      },
      innerRenderer: function(params) {
        console.log(params);

        if (params.node.group) {

            return '' + params.value + '';
        }

        return '<b style="display: inline-block;">' + params.data.project.projectID + '</b>\
         - <p style="display: inline-block; font-size:11px;">' + params.value + '</p>';
      },

    }
  };

  columnDefs = [

    {
     // headerName: "Category",
      field: 'category.categoryName',
      width: 120,
      rowGroup: true,

      // cellRenderer: "agGroupCellRenderer",
     // columnGroupShow: false,
     // marryChildren: true,
     // headerGroupTooltip: 'test tool tip',
      hide: true,
    },
    {

       headerName: 'Project',
       field: 'project.projectID',
       width: 90,
       suppressMenu: true,
       lockPosition: true,

     //  columnGroupShow: false,
      // rowGroup: true,
       hide: true,
     }
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    ) {  }





  ngOnInit() {

    // update these params if they change
    this.route.paramMap.subscribe(params => {
      this.routeParams.userId = params.get('user');
      this.routeParams.year = params.get('year');
      this.routeParams.payperiod = params.get('payperiod');

      this.fetchTimesheet();

    });


  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }

   onCellDoubleClicked($event) {}
   onCellEditingStopped($event) {}
   onCellEditingStarted($event) {}


  fetchTimesheet() {
    console.log(this.routeParams);

    // Auth layer on fetching.

    const url = '/timesheet/' + this.routeParams.userId + '/year/' + this.routeParams.year + '/payperiod/' + this.routeParams.payperiod + '';


    this.http.get<any>(environment.apiUrl + url)
    .subscribe(response => {
      console.log(response);
            this.timeSheetObj = response;
            this.constructTimesheet();
         });


  }

  constructTimesheet() {

    // this.rowData = this.timeSheetObj.framework;

    this.displayTimesheet = true;

    this.timeSheetObj.framework.forEach(category => {


      category.projects.forEach(project => {

          const row = {
            category: category,
            project: project,
          };




         this.timeSheetObj.payPeriod.dateArray.forEach(date => {

            try {
              row[date] = parseFloat(this.timeSheetObj.time.hours[category.category_id][project.projectID][date]);
            } catch (e) {
              row[date] = null;
            }

            if (isNaN(row[date])) { row[date] = null; }

         });

         this.timeSheetFramework.push(row);


      });


    });


    this.timeSheetObj.payPeriod.dateArray.forEach((date, i) => {

      // moment to convert date string to date + wahtever

      // identify if weekend

      const headerDate = moment(date).format('ddd DD');
      const day = moment(date).format('ddd');

      const cellStyle = {};

      if (day === 'Sun' || day === 'Sat') {
        cellStyle['background-color'] = '#E8F2FF';
      }


      const  obj: any = {
        headerName: headerDate,
        field: date,
        suppressMenu: true,
        width: 80,
         editable: true,
         lockPosition: true,
        type: 'numericColumn',
        timesheet_type: 'hours_field',
      tooltip: function (params) {

        if (params.node.group) { return null; }
        console.log(params);
        return params.data.project.projectID;
       // return (params.data.project.projectID);
       },
        aggFunc: function(data) {

          let sum = 0;
          data.forEach( function(value) {
            if (value) {
                sum = sum + parseFloat(value);
              }
          } );
          if (!sum) { return null; }
          return sum;
        },
        cellStyle: cellStyle

      };

      this.columnDefs.push(obj);
      // if day 7 push empty obj
      if (i === 6) {
        const emptyCol: any = {
          width: 40,
          headerName: ' ',
          field: null,
          lockPosition: true,
          suppressMenu: true,
          resizable: false,
        };
        this.columnDefs.push(emptyCol);
      }



    });

    this.rowData = this.timeSheetFramework;
    console.log(this.timeSheetFramework);
  }

}

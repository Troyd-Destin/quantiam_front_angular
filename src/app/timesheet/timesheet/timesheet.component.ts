import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {  environment} from '../../../environments/environment';

import {  HttpClient} from '@angular/common/http';

import { UserService } from '../../services/user/user.service';


import { NumericEditor } from './numeric-editor.component';

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

  timesheetStartYear = 2014;
  timesheetEndYear;
  currentYear = (new Date()).getFullYear();
  timesheetYears = [];
  timesheetPayperoids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
  timeSheetObj;
  timeSheetFramework = [];

  timesheetEditable = false;

  displayTimesheet = false;


  rowStyle = {

    border: '0px',
  };

  routeParams = {
    userId: null,
    year: null,
    payperoid: null,
  };

  defaultColDef = {
    resizable: false,
    editable: false,
  };



  autoGroupColumnDef = {
    headerName: 'Category',
    lockPosition: true,
    width: 380,
    suppressMenu: true,
    lockPinned: true,
    pinned: 'left',
    sortable: true,
    field: 'project.description',
    cellStyle: function (params) {
      const cellStyle = {};

      if (params.node.footer) {

        cellStyle['font-weight'] = 'bold !important';
        cellStyle['border-right'] = '0px !important';
      } else {

        cellStyle['cursor'] = 'pointer';
      }

      return cellStyle;
      console.log(params);




    },

    cellRendererParams: {
      suppressCount: true,
     // checkbox: true,
      padding: 20,
      innerRenderer: function(params) {
     //   console.log(params);

        if (params.node.group) {

            return '' + params.value + '';
        }

        return '<b style="display: inline-block; font-size: 12px;">' + params.data.project.projectID + '</b>\
         - <p style="display: inline-block; font-size:10px;">' + params.value + '</p>';
      },

    }
  };

  columnDefs = [

    {
     // headerName: "Category",
      field: 'category.categoryName',
      width: 120,
      rowGroup: true,
      rowPinned: true,

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


  rowClassRules = {

    'normal-row': function(params) {

      if (!params.node.footer && !params.node.group)  { return true; }
    },
    'footer-row': function(params) {
       if (params.node.footer) {
        console.log(params);
        return true;
      }
      return false;

    },
    'group-row': function (params) {
      if (params.node.group && !params.node.footer) {return true; }
    }

  };

  frameworkComponents = {
    numericEditor: NumericEditor
  };

  getRowHeight = function(params) {
    if (params.node.level === 0) {
      return 48;
    } else {
      return 35;
    }
  };


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    ) {  }





  ngOnInit() {

    // update these params if they change

    this.checkIfTimesheetEditable();

    this.route.paramMap.subscribe(params => {
      this.routeParams.userId = params.get('user');
      this.routeParams.year = params.get('year');
      this.routeParams.payperoid = params.get('payperoid');

      this.fetchTimesheet();

    });


    this.timesheetEndYear = this.currentYear + 1;
    let i;
    for ( i = this.timesheetStartYear; i <= this.timesheetEndYear; i++) {
      this.timesheetYears.push(i);
    }






  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

  }

   onCellDoubleClicked($event) {}
   onCellEditingStopped($event) {}
   onCellEditingStarted($event) {}


  fetchTimesheet() {
    console.log(this.routeParams);

    // Auth layer on fetching.

    const url = '/timesheet/' + this.routeParams.userId + '/year/' + this.routeParams.year + '/payperiod/' + this.routeParams.payperoid + '';


    this.http.get<any>(environment.apiUrl + url)
    .subscribe(response => {
      console.log(response);
            this.timeSheetObj = response;
            this.constructTimesheet();
         });


  }

  constructTimesheet() {

    // this.rowData = this.timeSheetObj.framework;
    this.timeSheetFramework = [];
    this.displayTimesheet = true;
    this.columnDefs.splice(2, 20);

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

    //

      const headerDate = moment(date).format('dd - DD');
      const long_headerDate = moment(date).format('dddd DD, YYYY');







      const  obj: any = {
        headerName: headerDate,
        field: date,
        suppressMenu: true,
        width: 80,
        lockPosition: true,
        type: 'numericColumn',
       // cellEditor: NumericEditor,
        timesheet_type: 'hours_field',
        tooltip: function (params) {

          if (params.node.group) { return null; }

          return long_headerDate + ' - Project ' + params.data.project.projectID;

        },
        aggFunc: this.sumHoursColumn,
        cellStyle: (params) => {

          const cellStyle = {

            'text-align': 'center',
          };

          const day = moment(params.column.colId).format('ddd');
          if ((day === 'Sun' || day === 'Sat') && !params.node.footer) {
            cellStyle['background-color'] = 'rgba(232, 242, 255,0.25)';
          }

          if (params.node.footer) {
            cellStyle['font-weight'] = 'bold';
            cellStyle['border'] = '0px';
            if (params.value > 8) {
              cellStyle['color'] = 'red';
            }
              cellStyle['color'] = 'black';
          }

          if (params.node.group && !params.node.footer) {
            cellStyle['font-size'] = '12px';

            cellStyle['font-style'] = 'italic';
          }
          return cellStyle;
        },


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
          editable: false,
        };
        this.columnDefs.push(emptyCol);
      }



    });

    if (!this.gridApi) {   this.rowData = this.timeSheetFramework; }

    if (this.gridApi) {

      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.setRowData(this.timeSheetFramework);
      this.gridApi.sizeColumnsToFit();
    }


    console.log(this.timeSheetFramework);
  }

  onRowGroupOpened(event) {
    console.log(event);

    console.log(this.rowData[0]);
   // this.gridApi.setPinnedTopRowData([this.rowData[0]]);
  }

  rowDataChanged(event) {


    console.log(event);
    this.gridApi.getRowStyle = function(params) {

      const rowStyle = {
        'border': '0px',
      };
      console.log(params);
      return rowStyle;

    };

  }

  sumHoursColumn(data) {

    let sum = 0;
    data.forEach( function(value) {
      if (value) {
          sum = sum + parseFloat(value);
        }
    } );
    if (!sum) { return null; }

    return sum.toFixed(2);
  }

  previousPayPeroid() {
    this.routeParams.payperoid  = parseInt(this.routeParams.payperoid, null) - 1;
    if (this.routeParams.payperoid  === 0) {

      this.routeParams.payperoid = 26;
      this.routeParams.year = parseInt(this.routeParams.year, null) - 1;

    }

    this.router.navigate([`/timesheet/${this.routeParams.userId}/year/${this.routeParams.year}/payperoid/${this.routeParams.payperoid}`]);

  }

  nextPayPeroid() {
    this.routeParams.payperoid  = parseInt(this.routeParams.payperoid, null) + 1;
    if (this.routeParams.payperoid  === 27) {

      this.routeParams.payperoid = 1;
      this.routeParams.year = parseInt(this.routeParams.year, null) + 1;

    }

    this.router.navigate([`/timesheet/${this.routeParams.userId}/year/${this.routeParams.year}/payperoid/${this.routeParams.payperoid}`]);

  }

  checkIfTimesheetEditable() {

    if (this.userService.hasPermission(10)) {
      console.log('worked');
      this.timesheetEditable = true;
      this.defaultColDef['editable'] = true;
      return;
    }

    return;

  }


  getRowClass(params) {
    console.log('test', params);

  }

}

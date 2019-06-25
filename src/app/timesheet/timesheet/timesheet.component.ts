import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  environment} from '../../../environments/environment';

import {  HttpClient} from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { TimesheetService } from '../timesheet.service';


import { NumericEditor } from './numeric-editor.component';


import { NotificationsService } from 'angular2-notifications';
import { faDownload } from '@fortawesome/free-solid-svg-icons';


import { AgGridTimesheetValueEditorComponent } from './ag-grid-timesheet-value-editor/ag-grid-timesheet-value-editor.component';

import * as moment from 'moment';

import {  delay } from 'rxjs/operators';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  faDownload = faDownload;

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
  lastCellEdited;
  timesheetLoaded = false;
  timesheetEditable = false;
  displayTimesheet = false;
  showSelectBox = false;
  showSelectBox2 = false;
  canChangeTimesheetUser = false;
  firstLoad = true;

  oldCellValue = {};

  rowStyle = {

    border: '0px',
  };

  routeParams = {
    userId: null,
    year: null,
    payperiod: null,
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

        // cellStyle['font-weight'] = 'bold !important';
        cellStyle['border-right'] = '0px !important';
      } else {

        cellStyle['cursor'] = 'pointer';
      }

      return cellStyle;




    },

    cellRendererParams: {
      suppressCount: true,
     // checkbox: true,
      padding: 20,
      innerRenderer: function(params) {


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
        return true;
      }
      return false;

    },
    'group-row': function (params) {
      if (params.node.group && !params.node.footer) {return true; }
    }

  };

  frameworkComponents = {
    numericEditor: AgGridTimesheetValueEditorComponent
  };

  getRowHeight = function(params) {
    if (params.node.level === 0 || params.node.footer) {
      return 48;
    } else {
      return 25;
    }
  };


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private notification: NotificationsService,
    private timesheetService: TimesheetService,
    ) {  }





  ngOnInit() {

    // update these params if they change

    this.checkIfTimesheetEditable();

    this.route.paramMap.subscribe(params => {
      this.routeParams.userId = params.get('user');
      this.routeParams.year = params.get('year');
      this.routeParams.payperiod = params.get('payperiod');

      setTimeout((x)=>{ this.fetchTimesheet(); },500);

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


   onCellEditingStopped($event) {

     let value = $event.value;

     if(!$event.value) { $event.value = ''; }
    if(this.oldCellValue[$event.column.colId] == null ){ this.oldCellValue[$event.column.colId] = ''; }

     if ("" + this.oldCellValue[$event.column.colId] + "" !== value ) {


     //$event.value = this.toNearest($event.value,0.25);

     // console.log($event.value, this.oldCellValue[$event.column.colId]);
      this.updateHours($event);

      }
      delete this.oldCellValue[$event.column.colId];
      return;
   }
   onCellEditingStarted($event) {



         // check for holiday
         if ($event.value && $event.value.length === 0 ) { $event.value = null; }
         this.oldCellValue[$event.column.colId] = $event.value;

         const holidayCheck = this.timeSheetObj.holidays.find((holiday) => {
          return holiday.date === $event.column.colId;
        });




       // console.log(this.oldCellValue[$event.column.colId], holidayCheck, $event);

        if ($event.data.category.categoryName === 'Absence' &&
        !($event.data.project.projectID === 5 && holidayCheck)
        ) {
         this.gridApi.stopEditing();
         return;
        }


   }


  fetchTimesheet() {
    // console.log(this.routeParams);

    // Auth layer on fetching.
    let url = '';


    if (this.routeParams.year.length > 0) { url = '/timesheet/' + this.routeParams.userId + '/year/' + this.routeParams.year + '/payperiod/' + this.routeParams.payperiod + ''; } else {
      this.routeParams.userId = this.userService.currentUser.id;
      url = '/timesheet/' +  this.routeParams.userId;
     }

    this.timesheetLoaded = false;

    this.http.get<any>(environment.apiUrl + url)
    //.pipe(delay(500))
    .subscribe(response => {
     // console.log(response);
            this.timeSheetObj = response;
            this.routeParams.year = response.payPeriod.year;
            this.routeParams.payperiod = response.payPeriod.payPeriod;
            window.history.replaceState({}, '', `/timesheet/${this.routeParams.userId}/year/${ this.routeParams.year}/payperiod/${ this.routeParams.payperiod }`);
            this.timesheetService.changeTimesheet(this.routeParams);
            this.displayTimesheet = true;
            setTimeout((x) => { this.constructTimesheet(); 
              
              if(this.firstLoad) {
                 // this.gridApi.redrawRows(); 
                  this.firstLoad = !this.firstLoad;
              }
            }, 400);
            setTimeout((x) => { this.timesheetLoaded = true; }, 1000);
         });


  }



  constructTimesheet() {

    // this.rowData = this.timeSheetObj.framework;
    this.timeSheetFramework = [];
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
        // editable: false,
        lockPosition: true,
        type: 'numericColumn',
        cellEditor: 'numericEditor',
        cellRenderer:  (params) => {



          if (params.node.group && !params.node.footer) { return '<i>' + $.trim(params.value) + '</i>'; }

          if (params.node.footer) {

            if (params.value > 8 && !this.timeSheetObj.machine) {
              console.log(params);
              if (this.timesheetLoaded) {
              this.notification.info('Overtime', params.column.colId + ' has more then 8 hours.', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton
              }
              return '<b style="color:red;">' + $.trim(params.value) + '</b>';

            }

            return '<b>' + $.trim(params.value) + '</b>';

           }

          if (params.value > 0) {

          // console.log(params);
         }

          let disabled = '';

          const holidayCheck = this.timeSheetObj.holidays.find((holiday) => {
            return holiday.date === params.column.colId;
          });


          if (params.data.category.categoryName === 'Absence' &&   !(params.data.project.projectID === 5 && holidayCheck)
           ||  (!this.timesheetEditable)) { disabled = 'disabled'; }

           return '<input class="form-control timesheet timesheet-input"  value="' + $.trim(params.value) + '" \
           \
           min="0"\
           step="0.25"\
           ' + disabled + ' ></input>';

        },
        timesheet_type: 'hours_field',
        // tooltipValueGetter: function (params) {

        //   if (params.node.group) { return null; }

        //   return long_headerDate + ' - Project ' + params.data.project.projectID;

        // },
        aggFunc: this.sumHoursColumn,
        cellStyle: (params) => {


          const cellStyle = {

            'text-align': 'center',
          //  'background-color': 'rgba(232, 242, 255,0.0)'
          };

          const absenceCheck = false;

        // if (Array.isArray(this.timeSheetObj.rto) && this.timeSheetObj.rto.length > 0) {
        //     this.timeSheetObj.rto.forEach((rto) => {

        //       if (absenceCheck) { return; }
        //       if (rto.status === 'approved') {

        //         rto.requested_time.forEach((time) => {

        //           if (time.date === params.column.colId) {

        //             absenceCheck = true;
        //             return;
        //             }
        //         });
        //       }


        //     });


        // }

        //   if (absenceCheck && !params.node.footer) {
        //     cellStyle['background-color'] = '#e8faff6b';
        //   }


          const holidayCheck = this.timeSheetObj.holidays.find((holiday) => {
            return holiday.date === params.column.colId;
          });

          const dateString = params.column.colId.split('_');
          const day = moment(dateString[0]).format('ddd');
          if ((holidayCheck || day === 'Sun' || day === 'Sat') && !params.node.footer) {

        //    if(holidayCheck){ params.column.holiday = true;}
            cellStyle['background-color'] = 'rgba(232, 242, 255,0.50)';

          }


          if (params.node.footer) {
           // cellStyle['font-weight'] = 'bold';
            cellStyle['border'] = '0px';
            if (params.value > 8 && !this.timeSheetObj.machine) {
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

    this.displayTimesheet = true;
    if (!this.gridApi) {   this.rowData = this.timeSheetFramework; }

    if (this.gridApi) {

      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.setRowData(this.timeSheetFramework);
      this.gridApi.sizeColumnsToFit();
    }

    setTimeout((x)=>{
       let test = document.getElementsByClassName("ag-group-value");
       let last = test[test.length-1];
       last.innerHTML   = '<b>Total</b> ( ' + this.timeSheetObj.denomination + ' )';
       console.log(last);
    },200);
    console.log(this.timeSheetFramework);
  }

  onRowGroupOpened(event) {
    console.log(event);

  }

  onRowClicked(event) {
    
    if(event.node.group)
    {
      event.node.setExpanded(!event.node.expanded); 
      
    }


  }



  rowDataChanged(event) {


    if (this.gridApi) {
      this.gridApi.getRowStyle = function(params) {

        const rowStyle = {
          'border': '0px',
        };

        return rowStyle;

      };
   }
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
    this.routeParams.payperiod  = parseInt(this.routeParams.payperiod, null) - 1;
    if (this.routeParams.payperiod  === 0) {

      this.routeParams.payperiod = 26;
      this.routeParams.year = parseInt(this.routeParams.year, null) - 1;

    }

    this.router.navigate([`/timesheet/${this.routeParams.userId}/year/${this.routeParams.year}/payperiod/${this.routeParams.payperiod}`]);

  }

  nextPayPeroid() {
    this.routeParams.payperiod  = parseInt(this.routeParams.payperiod, null) + 1;
    if (this.routeParams.payperiod  === 27) {

      this.routeParams.payperiod = 1;
      this.routeParams.year = parseInt(this.routeParams.year, null) + 1;

    }

    this.router.navigate([`/timesheet/${this.routeParams.userId}/year/${this.routeParams.year}/payperiod/${this.routeParams.payperiod}`]);

  }

  changePayperoid() {
    this.router.navigate([`/timesheet/${this.routeParams.userId}/year/${this.routeParams.year}/payperiod/${this.routeParams.payperiod}`]);

  }

  checkIfTimesheetEditable() {

    if (this.userService.hasPermission(10)) {

      this.timesheetEditable = true;
      this.defaultColDef['editable'] = true;
      return;
    }

    return;

  }


  getRowClass(params) {
    console.log('test', params);

  }

  updateHours(params) {

    this.lastCellEdited = params;
    const payload = {

      date: params.column.colId,
      payperoid: this.timeSheetObj.payPeriod.payPeriod,
      projectid: params.data.project.projectID,
      year: this.timeSheetObj.payPeriod.year,
      employeeid: this.timeSheetObj.userID,


    };

    if(params.value === ''){ params.value = 0;}
    payload[this.timeSheetObj.denomination.toLowerCase()] = '' + params.value + '';
    
    const url = '/timesheet/' + this.routeParams.userId + '/process';
    this.http.put<any>(environment.apiUrl + url + '?filterSpinner', payload)
    .subscribe(response => {

          if('overhours' in response){

                this.timeSheetObj.bank = response.bank;
                this.timeSheetObj.overhours[response.week - 1].daily_sum = response.totaldaily_overhours;
                this.timeSheetObj.overhours[response.week - 1].weekly_sum = response.totalweekly_overhours;
          }
            this.notification.success('Saved ', response.projectid + ', ' + response[this.timeSheetObj.denomination.toLowerCase()] + ' ' + this.timeSheetObj.denomination + ' on ' + response.date, {timeOut: 2000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton

         },
         error => {

            const rowNode = this.gridApi.getRowNode(params.rowIndex);
            params.data[params.column.colId] = null;
            rowNode.setData(params.data);
            this.gridApi.redrawRows();
            this.notification.error('error ',  'The data was not saved.', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton

         });
  }

  generateTimesheetDownload() {
    const url = '/timesheet/' + this.routeParams.userId + '/year/' + this.routeParams.year + '/payperiod/' + this.routeParams.payperiod + '/generate';

    // this.notification.info('Processing... ',  'Generating this timesheet.', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton

    this.http.get<any>(environment.apiUrl + url + '')
    .subscribe(r => {
      window.location.assign(r.url);
      this.notification.success('Success',  'Timesheet made!', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton

    });

  }

  selectedUserChanged(event) {

    this.routeParams.userId = event.id;



    this.router.navigate([`/timesheet/${this.routeParams.userId}/year/${this.routeParams.year}/payperiod/${this.routeParams.payperiod}`]);
    this.showSelectBox = false;

  }

 hideSelectBox() {
  this.showSelectBox2 = false;
  setTimeout((x) => {
    if (!this.showSelectBox2) {
        this.showSelectBox = false; 
      }
    
     } , 500 );
  }

  checkUserForSubordinatesAndMachines() {
    this.showSelectBox2 = true;
    if ((this.userService.hasMachines() && this.userService.hasSubordinates) || this.userService.hasPermission(1)) {
      this.canChangeTimesheetUser = true;
      this.showSelectBox = true;
    }

    return true;
  }


 
}

import { Component, OnInit } from '@angular/core';
import { SemDatabaseService } from './sem-database.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import {  environment} from '../../../environments/environment';


import { NotificationsService } from 'angular2-notifications';

import { AgGridSelectProjectEditorComponent } from '../../shared/ag-grid-select-project/ag-grid-select-project.component';
import { AgGridSelectUserComponent } from '../../shared/ag-grid-select-user/ag-grid-select-user.component';
import { AgGridSemTypeComponent } from './ag-grid-sem-type/ag-grid-sem-type.component';
import { AgGridDurationComponent } from '../../shared/ag-grid-duration/ag-grid-duration.component';

@Component({
  selector: 'app-sem-database',
  templateUrl: './sem-database.component.html',
  styleUrls: ['./sem-database.component.css']
})
export class SemDatabaseComponent implements OnInit {

   gridApi;
   gridColumnApi;

   pageSizes = [20, 25, 50, 100, 200];


   columnDefs;
   defaultColDef;
   rowData: [];

   editable = false;

   gridOptions;
   rowModelType;
   rowSelection;
   maxBlocksInCache;
   cacheBlockSize;
   oldCellValue;

   filteredOperator = '';
   filteredRequestor = '';
   filteredSampleType = '';
   filteredProject = '';
   filteredTextFilterName = '';
   filteredSemrun = '';
   timeoutTextFilter;

   frameworkComponents;

   totalRows;


  constructor(
    private semDatabaseService: SemDatabaseService,
    private http: HttpClient,
    private notification: NotificationsService,
    public router: Router,
  ) {

      this.columnDefs = [
        {
          headerName: 'ID',
          field: 'id',
          width: 100,
          hide: true,
          filter: false,
          editable: false,
        },
        {
          headerName: 'SEM',
          field: 'sem',
          width: 80,
          hide: true,
          filter: true,
          editable: false,
        },
        {
          headerName: 'ID',
          field: 'semrun_id',
          width: 80,
          filter: false,
          editable: false,
        },
        {
          headerName: 'Project',
          field: 'project_id',
          width: 70,
          filter: true,
          cellEditor: 'projectEditor',
        },
        {
          headerName: 'Sample Name',
          field: 'samplename',
          minwidth: 250,
          filter: false,
        },
        {
          headerName: 'Type',
          field: 'type',
           width: 120,
          filter: true,
          cellEditor: 'typeEditor',
          cellRenderer: (cell) => {
            if (cell.hasOwnProperty('data') && cell.data.type) { return cell.data.type.type; }
            return '';
          }
        },
        {
          headerName: 'Operator',
          field: 'operator',
          width: 80,
          filter: true,
          cellEditor: 'userEditor',

          cellRenderer: (cell) => {

            if (cell.hasOwnProperty('data') && cell.data.operator) { return cell.data.operator.name_abbrev; }
            return '';
          }
        },
        {
          headerName: 'Requested',
          field: 'requestor',
          width: 80,
          filter: true,
          cellEditor: 'userEditor',

          cellRenderer: (cell) => {
           // console.log(cell);
            if (cell.hasOwnProperty('data') && cell.data.requestor) { return cell.data.requestor.name_abbrev; }
            return '';
          }
        },
        {
          headerName: 'Duration',
          field: 'duration',
          width: 100,
          filter: false,
         // editable: false,
          cellEditor: 'durationEditor',
          cellRenderer: (cell) => {



             if (cell.hasOwnProperty('data') && cell.data.duration) {

                let minutes = (cell.data.duration / 60);

                if (minutes > 60) {
                    minutes = (minutes / 60);
                    return '~' + minutes.toFixed(2) + ' Hours';
                }
                return '~' + minutes.toFixed() + ' Mins';
             }
             return '';
           }
        },
        {
          headerName: 'Date',
          field: 'date_created',
         // width: 100,
          filter: false,
          editable: false,
        },
        {
          headerName: 'View',
          field: 'id',
          width: 60,
          filter: false,
          editable: false,
          onCellClicked: (cell ) => {

            if (cell.data) {
              this.router.navigate(['/sem/run/'+cell.data.semrun_id]);
             }
            //  console.log('worked');
  
          },
          cellRenderer: function(cell) {

            // console.log(cell);
             if (cell.value) {
               return '<p style="color:green; cursor:pointer;">View</p>';
             }
   
   
             return '';
           },
        },

      ];

      this.defaultColDef = {
        filter: true,
        sorting: true,
        editable: true,
       };



      this.gridOptions = {
        rowSelection: 'single',
        cacheBlockSize: 20,
        enableRangeSelection: true,
        // maxBlocksInCache: 2,
       // enableServerSideFilter: false,
       // enableServerSideSorting: false,
        rowModelType: 'serverSide',
        pagination: true,
        maxConcurrentDatasourceRequests: 1,
         paginationPageSize: 20,
        // paginationAutoPageSize: true
      };

      this.frameworkComponents = {
        projectEditor: AgGridSelectProjectEditorComponent,
        userEditor: AgGridSelectUserComponent,
        typeEditor: AgGridSemTypeComponent,
        durationEditor: AgGridDurationComponent
      };
   }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

      console.log(params.api);

    const datasource = this.fetchSemDatabase();

    params.api.setServerSideDatasource(datasource); // datasource needs to be a serverSide model

  }


  fetchSemDatabase () {

    return {
      getRows: (params2: any) => {

        const page = (this.gridApi.paginationGetCurrentPage() + 1);

        const requestParams: HttpParams = new HttpParams()
        .append('limit', `${this.gridOptions.cacheBlockSize}`)
        .append('like', `${this.filteredTextFilterName}`)
        .append('requestor', `${this.filteredRequestor}`)
        .append('operator', `${this.filteredOperator}`)
        .append('project', `${this.filteredProject}`)
        .append('type', `${this.filteredSemrun}`)
        .append('page', `${page}`);

          this.http.get(environment.apiUrl + '/instrument/sem/run', {params: requestParams}).subscribe((response: any) => {

               params2.successCallback(response.data, response.total);
               this.totalRows = response.total;
               this.gridApi.sizeColumnsToFit();
               console.log(params2);
          });

      }
    };

  }

  refreshDatabase() {

    const datasource = this.fetchSemDatabase();
    this.gridApi.setServerSideDatasource(datasource);
  }

  onTextFilterChanged() {
      clearTimeout(this.timeoutTextFilter);
      this.timeoutTextFilter = setTimeout((x) => {

              this.refreshDatabase();
      }, 500 );

  }

  onPageSizeChanged() {
    this.gridOptions.paginationPageSize = this.gridOptions.cacheBlockSize;
    this.refreshDatabase();

  }

  filterProject(event) {
    if (event) {  this.filteredProject = event.id; }
    else { this.filteredProject = ''; }
      this.refreshDatabase();
  }
  clearFilterProject(event) {
     this.filteredProject = '';
     this.refreshDatabase();
  }


  filterOperator(event) {
    if (event) { this.filteredOperator = event.id; } else { this.filteredOperator = ''; }

      this.refreshDatabase();
  }

  clearFilterOperator(event) {
     this.filteredOperator = '';
     this.refreshDatabase();
  }


  filterRequestor(event) {
    if (event) { this.filteredRequestor = event.id; } else { this.filteredRequestor = ''; }
    this.refreshDatabase();
  }

  clearFilterRequestor(event) {
     this.filteredRequestor = '';
     this.refreshDatabase();
  }

  filterSemrun(event) {
    if (event) {  this.filteredSemrun = event.type_id; } else { this.filteredSemrun = ''; }
    this.refreshDatabase();
  }

  clearFilterSemrun(event) {
     this.filteredSemrun = '';
     this.refreshDatabase();
  }

  onCellEditingStopped($event) {

    let value = $event.value;
    if (value === '') { value = null; }
    if (this.oldCellValue !== value ) {
      this.updateSemRun($event);
     }
     return;
  }
  onCellEditingStarted($event) {

        console.log($event);
        this.oldCellValue = $event.value;
        return;


  }

  updateSemRun(cell) {

    console.log(cell);

    const params: any = {};

    if (cell.column.colId === 'requestor') { params.requested_by = cell.data.requestor.id; }
    if (cell.column.colId === 'operator') { params.operator_id = cell.data.operator.id; }
    if (cell.column.colId === 'project_id') { params.project_id = cell.value; }
    if (cell.column.colId === 'samplename') { params.samplename = cell.value; }
    if (cell.column.colId === 'type') { params.type_id = cell.data.type.type_id; }
    if (cell.column.colId === 'duration') { params.duration = cell.value; }

    console.log(params);

     this.http.put(environment.apiUrl + '/instrument/sem/run/' + cell.data.semrun_id + '?filterSpinner', params)
    .subscribe(response => {

      this.notification.success('Success', 'This field was updated', {showProgressBar: false, timeOut: 2000, clickToClose: true});
      // Sanitized logo returned from backend
    },
    error => {
                this.notification.error('Error', error.error.error, {showProgressBar: false, timeOut: 5000, clickToClose: true});

    });


  }


}



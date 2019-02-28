import { Component, OnInit } from '@angular/core';
import { SemDatabaseService } from './sem-database.service';
import { HttpClient,HttpParams } from '@angular/common/http';

import {  environment} from '../../../environments/environment';


import { NotificationsService } from 'angular2-notifications';

import { AgGridSelectProjectEditorComponent } from '../../shared/ag-grid-select-project/ag-grid-select-project.component';
import { AgGridSelectUserComponent } from '../../shared/ag-grid-select-user/ag-grid-select-user.component';

@Component({
  selector: 'app-sem-database',
  templateUrl: './sem-database.component.html',
  styleUrls: ['./sem-database.component.css']
})
export class SemDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  private pageSizes = [20, 25, 50, 100, 200];


  private columnDefs;
  private defaultColDef;
  private rowData: [];

  private editable = false;

  private gridOptions;
  private rowModelType;
  private rowSelection;
  private maxBlocksInCache;
  private cacheBlockSize;
  private oldCellValue;

  private filteredOperator = '';
  private filteredRequestor = '';
  private filteredSampleType = '';
  private filteredProject = '';
  private filteredTextFilterName = '';
  private timeoutTextFilter;

  private frameworkComponents;

  private totalRows;


  constructor(
    private semDatabaseService: SemDatabaseService,
    private http: HttpClient,
    private notification: NotificationsService,
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
          filter: false,
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
           width: 150,
          filter: true,
          cellRenderer: (cell) => {
            if(cell.data.type){ return cell.data.type.type; }
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
          
            if(cell.data.operator){ return cell.data.operator.name_abbrev; }
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
            if(cell.data.requestor){ return cell.data.requestor.name_abbrev; }
            return '';
          }
        },
        {
          headerName: 'Duration',
          field: 'duration',
          //width: 100,
          filter: false,
          editable: false,
        },
        {
          headerName: 'Date',
          field: 'date_created',
         // width: 100,
          filter: false,
          editable: false,
        },
        {
          headerName: 'Actions',
          field: 'id',
         // width: 100,
          filter: false,
          editable: false,
          cellRenderer: (cell) => {

             return '';
           }
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
        //paginationAutoPageSize: true
      };

      this.frameworkComponents = {
        projectEditor: AgGridSelectProjectEditorComponent,
        userEditor: AgGridSelectUserComponent,
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


  fetchSemDatabase ()
  { 
  
    return {
      getRows: (params2: any) => {

        const page = (this.gridApi.paginationGetCurrentPage() + 1);

        const requestParams: HttpParams = new HttpParams()
        .append('limit', `${this.gridOptions.cacheBlockSize}`)
        .append('like', `${this.filteredTextFilterName}`)
        .append('requestor', `${this.filteredRequestor}`)
        .append('operator', `${this.filteredOperator}`)
        .append('project', `${this.filteredProject}`)
        .append('page', `${page}`);

          this.http.get(environment.apiUrl + '/instrument/sem/run', {params: requestParams}).subscribe((response:any) => {

               params2.successCallback(response.data, response.total);
               this.totalRows = response.total;
               this.gridApi.sizeColumnsToFit();
               console.log(params2);
          });

      }
    }

  }

  refreshDatabase()
  {

    const datasource = this.fetchSemDatabase();
    this.gridApi.setServerSideDatasource(datasource);
  }

  onTextFilterChanged()
  {
      clearTimeout(this.timeoutTextFilter);
      this.timeoutTextFilter = setTimeout((x) => {

              this.refreshDatabase();
      }, 500 )

  }

  onPageSizeChanged()
  {
    this.gridOptions.paginationPageSize = this.gridOptions.cacheBlockSize;
    this.refreshDatabase();
  
  }

  filterProject(event)
  {
      this.filteredProject = event.id;
      this.refreshDatabase();
  }
  clearFilterProject(event)
  {
     this.filteredProject = '';
     this.refreshDatabase();
  }


  filterOperator(event)
  {
      this.filteredOperator = event.id;
      this.refreshDatabase();
  }

  clearFilterOperator(event)
  {
     this.filteredOperator = '';
     this.refreshDatabase();
  }


  filterRequestor(event)
  {
    this.filteredRequestor = event.id;
    this.refreshDatabase();
  }

  clearFilterRequestor(event)
  {
     this.filteredRequestor = '';
     this.refreshDatabase();
  }

  onCellEditingStopped($event) {

    let value = $event.value;
    if (value === "") { value = null; }
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

  updateSemRun(cell)
  {

    console.log(cell);

    const params: any = {};

    if(cell.column.colId === 'requestor') { params.requested_by = cell.data.requestor.id; }
    if(cell.column.colId === 'operator') { params.operator_id = cell.data.operator.id; }
    if(cell.column.colId === 'project_id') { params.project_id = cell.value; }
    if(cell.column.colId === 'samplename') { params.samplename = cell.value; }

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



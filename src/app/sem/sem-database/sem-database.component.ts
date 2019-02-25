import { Component, OnInit } from '@angular/core';
import { SemDatabaseService } from './sem-database.service';
import { HttpClient,HttpParams } from '@angular/common/http';
import { IGetRowsParams  } from 'ag-grid-community';

import {  environment} from '../../../environments/environment';

@Component({
  selector: 'app-sem-database',
  templateUrl: './sem-database.component.html',
  styleUrls: ['./sem-database.component.css']
})
export class SemDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  private pageSizes = [25, 50, 100];


  private columnDefs;
  private defaultColDef;
  private rowData: [{id:100,semrun_id:'thing'}];

  private gridOptions;
  private rowModelType;
  private rowSelection;
  private maxBlocksInCache;
  private cacheBlockSize;

  private filteredOperator = '';
  private filteredRequestor = '';
  private filteredSampleType = '';
  private filteredProject = '';
  private filteredTextFilterName = '';
  private timeoutTextFilter;

  private totalRows;


  constructor(
    private semDatabaseService: SemDatabaseService,
    private http: HttpClient,
  ) {

      this.columnDefs = [
        {
          headerName: 'ID',
          field: 'id',
          width: 100,
          hidden: true,
          filter: false
        },
        {
          headerName: 'SEM',
          field: 'sem',
          width: 100,
          hidden: true,
          filter: false
        },
        {
          headerName: 'ID',
          field: 'semrun_id',
          width: 100,
          filter: false
        },
        {
          headerName: 'Project',
          field: 'project_id',
          width: 100,
          filter: true
        },
        {
          headerName: 'Sample Name',
          field: 'samplename',
          minwidth: 200,
          filter: false
        },
        {
          headerName: 'Sample Type',
          field: 'type.type_id',
         // width: 100,
          filter: true
        },
        {
          headerName: 'Operator',
          field: 'operator_id',
         // width: 100,
          filter: true
        },
        {
          headerName: 'Requested',
          field: 'requested_by',
         // width: 100,
          filter: true
        },
        {
          headerName: 'Duration',
          field: 'duration',
          width: 100,
          filter: false
        },
        {
          headerName: 'Date',
          field: 'date_created',
         // width: 100,
          filter: false
        },

      ];

      this.defaultColDef = {
        filter: true,
        sorting: true,
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

  onTextFilterChanged()
  {
      clearTimeout(this.timeoutTextFilter);
      this.timeoutTextFilter = setTimeout((x) => {

            console.log('test');
            const datasource = this.fetchSemDatabase();
            this.gridApi.setServerSideDatasource(datasource);
      }, 500 )

  }

  onPageSizeChanged()
  {
    this.gridOptions.paginationPageSize = this.gridOptions.cacheBlockSize;
    const datasource = this.fetchSemDatabase();
    this.gridApi.setServerSideDatasource(datasource);
  }


}



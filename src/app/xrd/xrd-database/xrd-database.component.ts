import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {  environment} from '../../../environments/environment';


import { AgGridSelectProjectEditorComponent } from '../../shared/ag-grid-select-project/ag-grid-select-project.component';
import { XrdAnalysesFileRendererComponent } from './xrd-analyses-file-renderer/xrd-analyses-file-renderer.component';

@Component({
  selector: 'app-xrd-database',
  templateUrl: './xrd-database.component.html',
  styleUrls: ['./xrd-database.component.css']
})
export class XrdDatabaseComponent implements OnInit {

   gridApi;
   gridColumnApi;

   pageSizes = [20, 25, 50, 100];


   columnDefs;
   defaultColDef;
   rowData: [];

   gridOptions;
   rowModelType;
   rowSelection;
   maxBlocksInCache;
   cacheBlockSize;

   filteredOperator = '';
   filteredRequestor = '';
   filteredSampleType = '';
   filteredProject = '';
   filteredTextFilterName = '';
   timeoutTextFilter;

   totalRows;

    frameworkComponents = {
    projectEditor: AgGridSelectProjectEditorComponent,
    analysesRenderer: XrdAnalysesFileRendererComponent,
  };

  constructor(private http: HttpClient) {

    this.columnDefs = [
      {
        headerName: 'ID',
        field: 'id',
        width: 50,
        hide: true,
      },
      {
        headerName: '',
        field: 'instrument_name',
        width: 50,
        hide: true,
      },
      {
        headerName: 'Run',
        field: 'name',
        width: 100,
      },
      {
        headerName: 'Project',
        field: 'project_id',
        width: 70,
        editable: true,
        cellEditor: 'projectEditor',
      },
      {
        headerName: 'Sample Name',
        field: 'sample_name',
        width: 400,
      },
      {
        headerName: 'Type',
        field: 'type.name',
        width: 100,
      },

      
     /*  {
        headerName: 'File Name',
        field: 'path',
        width: 200,
        cellRenderer: (cell) =>{
          let filename =  cell.data.path.split('\\').pop().split('/').pop();
          return filename;
        }

      }, */
      {
        headerName: 'Operator',
        field: 'operator',
        width: 100,
      },
      {
        headerName: 'Requested By',
        field: 'requestor',
        width: 100,
      },
      {
        headerName: 'Duration',
        field: 'duration',
        width: 100,
        cellRenderer: (cell) => {

            let duration;

          if(cell.data.duration)
          {
             duration =  '~' + (cell.data.duration / 60).toFixed(1) + ' mins';
          }
        
          return duration;
        }
      },
       {
        headerName: 'Analyses',
        field: 'xrd_runs',
        width: 80,
        cellRenderer: 'analysesRenderer',
      }, 
      {
        headerName: 'Run Date',
        field: 'analyzed_date',
        width: 150,
      },

    ];

    this.defaultColDef = {
      filter: false,
      sorting: true,
      resizable: true,
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
 }

ngOnInit() {
}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

      console.log(params.api);

    const datasource = this.fetchDatabase();

    params.api.setServerSideDatasource(datasource); // datasource needs to be a serverSide model

  }


  fetchDatabase () {

    return {
      getRows: (params2: any) => {

        const page = (this.gridApi.paginationGetCurrentPage() + 1);

        const requestParams: HttpParams = new HttpParams()
        .append('limit', `${this.gridOptions.cacheBlockSize}`)
        .append('like', `${this.filteredTextFilterName}`)
        .append('page', `${page}`);

          this.http.get(environment.apiUrl + '/instrument/xrd/run', {params: requestParams}).subscribe((response: any) => {

              params2.successCallback(response.data, response.total);
              this.totalRows = response.total;
              this.gridApi.sizeColumnsToFit();
              console.log(params2);
          });

      }
    };

  }

  onTextFilterChanged() {
      clearTimeout(this.timeoutTextFilter);
      this.timeoutTextFilter = setTimeout((x) => {

            console.log('test');
            const datasource = this.fetchDatabase();
            this.gridApi.setServerSideDatasource(datasource);
      }, 800 );

  }

  onPageSizeChanged() {
    this.gridOptions.paginationPageSize = this.gridOptions.cacheBlockSize;
    const datasource = this.fetchDatabase();
    this.gridApi.setServerSideDatasource(datasource);
  }

}



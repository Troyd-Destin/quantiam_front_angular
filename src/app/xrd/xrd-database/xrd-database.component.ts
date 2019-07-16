import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

import {  environment} from '../../../environments/environment';

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
   rowData: [{id:100,semrun_id:'thing'}];

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

  constructor(private http: HttpClient) { 

    this.columnDefs = [
      {
        headerName: 'ID',
        field: 'id',
        width: 60,
        hidden: true,
      },
     /*  {
        headerName: 'XRD',
        field: 'instrument_name',
        width: 60,
        filter: false
      }, */
      {
        headerName: 'Run',
        field: 'xrd_run.xrdrun_id',
        width: 100,
      },
      {
        headerName: 'Project',
        field: 'xrd_run.project_id',
        width: 80,
        filter: true
      },
      {
        headerName: 'Analysis Name',
        field: 'name',
        width: 400,
        
      },
      {
        headerName: 'Sample Type',
        field: 'xrd_run.type.id',
       // width: 100,
        filter: true
      },
      {
        headerName: 'Operator',
        field: 'xrd_run.operator.id',
       // width: 100,
        filter: true
      },
      {
        headerName: 'Requested',
        field: 'xrd_run.requestor.id',
       // width: 100,
        filter: true
      },
      {
        headerName: 'Duration',
        field: 'xrd_run.duration',
        width: 100,
      
      },
      {
        headerName: 'Run Date',
        field: 'analyzed_date',
       // width: 100,
       
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
      //paginationAutoPageSize: true
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


  fetchDatabase ()
  { 

    return {
      getRows: (params2: any) => {

        const page = (this.gridApi.paginationGetCurrentPage() + 1);

        const requestParams: HttpParams = new HttpParams()
        .append('limit', `${this.gridOptions.cacheBlockSize}`)
        .append('like', `${this.filteredTextFilterName}`)
        .append('page', `${page}`);

          this.http.get(environment.apiUrl + '/instrument/xrd/analysis', {params: requestParams}).subscribe((response:any) => {

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
            const datasource = this.fetchDatabase();
            this.gridApi.setServerSideDatasource(datasource);
      }, 500 )

  }

  onPageSizeChanged()
  {
    this.gridOptions.paginationPageSize = this.gridOptions.cacheBlockSize;
    const datasource = this.fetchDatabase();
    this.gridApi.setServerSideDatasource(datasource);
  }

}



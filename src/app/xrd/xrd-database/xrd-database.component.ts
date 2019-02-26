import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

import {  environment} from '../../../environments/environment';

@Component({
  selector: 'app-xrd-database',
  templateUrl: './xrd-database.component.html',
  styleUrls: ['./xrd-database.component.css']
})
export class XrdDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  private pageSizes = [20, 25, 50, 100];


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

  constructor(private http: HttpClient) { 

    this.columnDefs = [
      {
        headerName: 'ID',
        field: 'id',
        width: 80,
        hidden: true,
      },
      {
        headerName: 'XRD',
        field: 'instrument_name',
        width: 60,
        filter: false
      },
      {
        headerName: 'Run',
        field: 'xrdrun_id',
        width: 100,
      },
      {
        headerName: 'Project',
        field: 'project_id',
        width: 70,
        filter: true
      },
      {
        headerName: 'Sample Name',
        field: 'name',
        minwidth: 250,
       
      },
      {
        headerName: 'Sample Type',
        field: 'type.id',
       // width: 100,
        filter: true
      },
      {
        headerName: 'Operator',
        field: 'operator.id',
       // width: 100,
        filter: true
      },
      {
        headerName: 'Requested',
        field: 'requestor.id',
       // width: 100,
        filter: true
      },
      {
        headerName: 'Duration',
        field: 'duration',
        width: 100,
      
      },
      {
        headerName: 'Date',
        field: 'analyzed_date',
       // width: 100,
       
      },

    ];

    this.defaultColDef = {
      filter: false,
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

          this.http.get(environment.apiUrl + '/instrument/xrd/run', {params: requestParams}).subscribe((response:any) => {

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



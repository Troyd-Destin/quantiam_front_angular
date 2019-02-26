import { Component, OnInit } from '@angular/core';
import { SemDatabaseService } from './sem-database.service';
import { HttpClient,HttpParams } from '@angular/common/http';

import {  environment} from '../../../environments/environment';

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
          hide: true,
          filter: false
        },
        {
          headerName: 'SEM',
          field: 'sem',
          width: 80,
          filter: false
        },
        {
          headerName: 'ID',
          field: 'semrun_id',
          width: 80,
          filter: false
        },
        {
          headerName: 'Project',
          field: 'project_id',
          width: 70,
          filter: true
        },
        {
          headerName: 'Sample Name',
          field: 'samplename',
          minwidth: 250,
          filter: false,
          editable: true,
        },
        {
          headerName: 'Type',
          field: 'type.type_id',
           width: 150,
          filter: true,
          cellRenderer: (cell) => {
            if(cell.data.type){ return cell.data.type.type; }
            return '';
          }
        },
        {
          headerName: 'Operator',
          field: 'operator_id',
          width: 80,
          filter: true,
          cellRenderer: (cell) => {
            if(cell.data.operator){ return cell.data.operator.name_abbrev; }
            return '';
          }
        },
        {
          headerName: 'Requested',
          field: 'requested_by',
          width: 80,
          filter: true,
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

}



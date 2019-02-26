import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

import {environment} from '../../../environments/environment';

import * as moment from 'moment';

@Component({
  selector: 'app-timesheet-rto',
  templateUrl: './timesheet-rto.component.html',
  styleUrls: ['./timesheet-rto.component.css']
})
export class TimesheetRtoComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  private pageSizes = [10, 20, 25, 50, 100, 200];

  private showSubordinatesOnly = true;


  private columnDefs;
  private defaultColDef;
  private rowData: [];

  private gridOptions;
  private rowModelType;
  private rowSelection;
  private maxBlocksInCache;
  private cacheBlockSize;

  private filteredRtoOwner = '';
  private filteredStatus = '';
  private filteredTextFilterName = '';
  private timeoutTextFilter;

  private totalRows;

  constructor(
    private http: HttpClient,
  ) {

    this.columnDefs = [
      {
        headerName: 'ID',
        field: 'requestID',
        width: 50,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Employee',
        field: 'owner.name',
        width: 90,
        filter: false
      },
      {
        headerName: 'Hours',
        field: 'time_requests',
        width: 150,
        filter: false,
        cellRenderer: (cell) => { 

          let sum = {

            pto: 0,
            cto: 0,
            vacation: 0,
            unpaid: 0,
          };

          if (cell.data.time_requests[0]){

            cell.data.time_requests.forEach(element => {

            })

          }

          return '<table class=""><thead><tr><td> PTO </td><td> Vacation</td> <td> Unpaid </td> <td> CTO </td> </tr> </thead>\
          <tbody><tr><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody>\
          </table>';

        }
      },
      {
        headerName: 'Dates',
        field: 'time_requests',
      
        filter: true,
        cellRenderer: (cell) => { 

          let str = ''; 
          if (cell.data.time_requests[0]){

            cell.data.time_requests.forEach(element => {
             
              str = str + moment(element.date).format('dd') + '<b>' + moment(element.date).format(' MMM DD') + '</b>, ';
            });

            str = str.substring(0, str.length - 1);
            return str;

          }

          return ''; 
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 70,
        filter: false,
        editable: true,
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
      rowModelType: 'serverSide',
      pagination: true,
      maxConcurrentDatasourceRequests: 1,
       paginationPageSize: 20,
       //rowHeight: 25
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
        .append('employee', `${this.filteredRtoOwner}`)
        .append('status', `${this.filteredStatus}`)
        .append('page', `${page}`);

          this.http.get(environment.apiUrl + '/rto', {params: requestParams}).subscribe((response:any) => {

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

    const datasource = this.fetchDatabase();
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

  
  filterRtoOwner(event)
  {
      this.filteredRtoOwner = event.id;
      this.refreshDatabase();
  }
  clearRtoOwner(event)
  {
     this.filteredRtoOwner = '';
     this.refreshDatabase();
  }

  statusChanged(event)
  {
    this.filteredStatus = event.value;
    this.refreshDatabase();
      console.log(event);
  }

}

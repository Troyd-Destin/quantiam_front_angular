import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';


import { AllModules  } from '@ag-grid-enterprise/all-modules';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ncr-database',
  templateUrl: './ncr-database.component.html',
  styleUrls: ['./ncr-database.component.css']
})
export class NcrDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  rowData: any = [{}, {}];
  modules = AllModules;
  rowModelType;
  rowSelection;
  maxBlocksInCache;
  cacheBlockSize;
  oldCellValue;
  timeoutTextFilter;
  components: any;
  statusBar: any;
  getRowNodeId;
  icons;
  cellOldValue;
  searchBarValue: string;
  frameworkComponents;
  totalRows;
  context;

  statusTypes = [
    {id:'draft',value:'Draft'},
    {id:'ongoing',value:'Ongoing'},
    {id:'resolved',value:'Resolved'}
  ]
  
  typeTypes = [
    {id:'procedure',value:'Procedure'},
    {id:'product',value:'Product'},
  ]

  
  columnDefs = [
    {
      field: 'id',      
      headerName: 'ID',
      width: 30,
    },
    {
      field: 'name',      
      headerName: 'NCR Name',
      width: 100,
    },
     {
      field: 'type',      
      headerName: 'Type',
      width: 100,
    },    
    {
      field: 'buisness_unit',      
      headerName: 'Buisness Unit',
      width: 100,
    },
    {
      field: 'severity',      
      headerName: 'Severity',
      width: 100,
    },    
    {
      field: 'created_at',      
      headerName: 'Created',
      width: 100,
    },
    {
      field: 'status',      
      headerName: 'Status',
      width: 100,
    },
  ];

  defaultColDef = {

    sortable: true,
    resizable: true,
    filter: false,
    cellStyle: function (params) {
      return {
        cursor: 'pointer',
      };
    },

  };

  gridOptions = {
    rowSelection: 'single',
    cacheBlockSize: 18,
    enableRangeSelection: true,
     maxBlocksInCache: 2,
   //  enableServerSideFilter: true,
    enableServerSideSorting: false,
    rowModelType: 'serverSide',
    pagination: true,
    maxConcurrentDatasourceRequests: 1,
   // paginationPageSize: 20,
    paginationAutoPageSize: true
  };


  constructor(public router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
  }

  
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const datasource = this.fetchDatabase();
    params.api.setServerSideDatasource(datasource); // datasource needs to be a serverSide model

  }

  sizeColumnsToFit() {
    setTimeout(() => {  this.gridApi.sizeColumnsToFit(); }, 300);
  }

  onRowDoubleClicked(event) {
    this.router.navigate(['/quality/ncr/' + event.data.id]); 
    return;
  }

refreshDatabase()
{
  const datasource = this.fetchDatabase();
  this.gridApi.setServerSideDatasource(datasource);
}

fetchDatabase () {

  return {
    getRows: (params2: any) => {
      console.log(params2);
      const page = (this.gridApi.paginationGetCurrentPage() + 1);

       const requestParams: HttpParams = new HttpParams();
     /* .append('limit', `${this.gridOptions.cacheBlockSize}`)
      .append('like', `${this.filteredTextFilterName}`)
      .append('hazards[]', this.hazardSearchFilter)
      .append('suppliers[]', this.supplierSearchFilter)
      .append('locations[]', this.locationSearchFilter)
      .append('page', `${page}`); */



        this.http.get(environment.apiUrl + '/ncr', {params: requestParams}).subscribe((response: any) => {

             params2.successCallback(response.data, response.total);
             this.totalRows = response.total;
             this.gridApi.sizeColumnsToFit();
           ///  console.log(params2);
        });

    }
  };

}

  createNCR()
  {
    //http to create ncr
    this.http.post(environment.apiUrl+'/ncr', {}).subscribe((r:any)=>{
        this.refreshDatabase();
       this.router.navigate(['/quality/ncr/' + r.id]);
    })

  }

}

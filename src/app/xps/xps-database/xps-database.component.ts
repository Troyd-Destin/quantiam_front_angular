import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-xps-database',
  templateUrl: './xps-database.component.html',
  styleUrls: ['./xps-database.component.css']
})
export class XpsDatabaseComponent implements OnInit {

  
  private gridApi;
  private gridColumnApi;
  private rowData: any[];
  private paginationPageSize = 25;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
        
         
    
  }

  
  
   private columnDefs = [
        {headerName: 'ID', field: 'id', width:100},
        {headerName: 'Run #', field: 'name',},
        {headerName: 'Project', field: 'project',},
        {headerName: 'Sample Name', field: 'sample_name',},
        {headerName: 'Hours',field: 'duration',  type: "numericColumn", valueGetter: function aPlusBValueGetter(params) {
        
          if(params.data.duration)
          {
            return parseFloat((params.data.duration/60/24).toFixed(2));
          }
           return null;
        }},
         {headerName: 'Seconds', field: 'duration', type: "numericColumn",},
        {headerName: 'Analyses', field: 'analyses', type: "numericColumn",},
        {headerName: 'Operator', field: 'operator',},
        {headerName: 'Requested By', field: 'requested_by',},
        {headerName: 'Run Created', field: 'updated_at'},
    ];
    
  onPageSizeChanged(newPageSize) {
    var value = document.getElementById("page-size").value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

    
    
  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  
           this.http.get<any>('http://api.edm.quantiam.com/xps/runs',{params: { }}).subscribe((r)=>{
             
                this.rowData = r;
               //setTimeout(()=>{  this.autoSizeAll();},400);
             });
             
    
      params.api.sizeColumnsToFit();
    
  }
  
  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  
}

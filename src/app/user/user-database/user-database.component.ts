import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-database',
  templateUrl: './user-database.component.html',
  styleUrls: ['./user-database.component.css']
})
export class UserDatabaseComponent implements OnInit {


  private gridApi;
  private gridColumnApi;
  private rowData: any;
  private paginationPageSize = 25;
  private searchBarValue: string;
  
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
        
         
    
  }

  
  
   private columnDefs = [
        {headerName: 'ID', sort:'desc', field: 'employeeid', suppressMenu: true,
        headerTooltip:"Employee #",cellStyle: function(params) { return {cursor:'pointer'}}, filter:'agTextColumnFilter', maxWidth:60, },
        {headerName: 'Firstname', field: 'firstname', cellStyle: function(params) { return {cursor:'pointer'}}, maxWidth:130, },
        {headerName: 'Lastname', field: 'lastname',cellStyle: function(params) { return {cursor:'pointer'}}, },
        {headerName: 'Email', field: 'email', cellStyle: function(params) { return {cursor:'pointer'}}, },
        {headerName: 'Username', field: 'ldap_username', hide:true, cellStyle: function(params) { return {cursor:'pointer'}},},
        {headerName: 'Title', field: 'title', cellStyle: function(params) { return {cursor:'pointer'}},},
        {headerName: 'Compensation', field: 'compensation', cellStyle: function(params) { return {cursor:'pointer'}},},
        {headerName: 'Supervisor',field: 'employeeid',  valueGetter: function aPlusBValueGetter(params) {
            return params.data.supervisor.name;
        }, cellStyle: function(params) { return {cursor:'pointer'}},},
        {headerName: 'Start Date', field: 'startdate', cellStyle: function(params) { return {cursor:'pointer'}},},
        {headerName: 'Leave Date', field: 'leavedate', cellStyle: function(params) { return {cursor:'pointer'}},},
    ];
    
  onPageSizeChanged(newPageSize) {
    var value = (<HTMLInputElement>document.getElementById("page-size")).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
 
   onRowDoubleClicked(event)
  {
    this.router.navigate(['/user/'+event.data.employeeid]);
    
    
  }
    
  onFilterChanged()
  {
    this.gridApi.setQuickFilter(this.searchBarValue);
  }
    
  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
	
	
	        var obj:any = {'params':{ 'supervisor': true}};
  
           this.http.get<any>('http://api.edm.quantiam.com/users',obj).subscribe((r)=>{
             
                this.rowData = r;
                  setTimeout(()=>{  this.gridApi.sizeColumnsToFit();},600);
             });
             
    
      
    
  }
  
  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

 
  
}

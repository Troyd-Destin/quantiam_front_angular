import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
        
         
    
  }

  
  
   private columnDefs = [
        {headerName: 'ID', field: 'employeeid',},
        {headerName: 'Firstname', field: 'firstname',  },
        {headerName: 'Lastname', field: 'lastname', },
        {headerName: 'Email', field: 'email', },
        {headerName: 'Username', field: 'ldap_username', },
        {headerName: 'Title', field: 'title'},
        {headerName: 'Compensation', field: 'compensation', },
        {headerName: 'Supervisor',field: 'employeeid',  valueGetter: function aPlusBValueGetter(params) {
            return params.data.supervisor.name;
        }},
        {headerName: 'Start Date', field: 'startdate'},
        {headerName: 'Leave Date', field: 'leavedate'},
    ];
    
  onPageSizeChanged(newPageSize) {
    var value = (<HTMLInputElement>document.getElementById("page-size")).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

    
    
  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
	
	
	var obj:any = {'params':{ 'supervisor': true}};
  
           this.http.get<any>('http://api.edm.quantiam.com/users',obj).subscribe((r)=>{
             
                this.rowData = r;
               setTimeout(()=>{  this.autoSizeAll();},400);
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

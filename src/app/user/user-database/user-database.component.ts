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




   private columnDefs = [
        {headerName: '#', sort: 'desc', field: 'employeeid',
        headerTooltip: '#',  filter: 'agTextColumnFilter', maxWidth: 90, },
        {headerName: 'Firstname', field: 'firstname',   maxWidth: 130, },
        {headerName: 'Lastname', field: 'lastname', maxWidth: 130, },
        {headerName: 'Ext.', field: 'extension',  maxWidth: 100, },
        {headerName: 'Email', field: 'email',   },
        {headerName: 'Username', field: 'ldap_username', hide: true,  },
        {headerName: 'Title', field: 'title',  },
        {headerName: 'Compensation', field: 'compensation', maxWidth: 130, },
        {headerName: 'Supervisor', field: 'employeeid', maxWidth: 150, valueGetter: function aPlusBValueGetter(params) {
            return params.data.supervisor.name;
        },  },
       
        {headerName: 'Start Date', field: 'startdate',  },
        {headerName: 'Leave Date', field: 'leavedate',  },
    ];

    private defaultColDef = {

     // maxWidth:120,
      sorting: true,
     //   suppressMenu: true,
      sortable: true,
      filter: true,
      cellStyle: function (params) {
        return {
          cursor: 'pointer',
        };
      },

    };

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {  }


  onPageSizeChanged(newPageSize) {
    const value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

   onRowDoubleClicked(event) {
    this.router.navigate(['/user/' + event.data.employeeid]);


  }

  onFilterChanged() {
    this.gridApi.setQuickFilter(this.searchBarValue);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;


	        const obj: any = {'params': { 'supervisor': true}};

           this.http.get<any>('http://api.edm.quantiam.com/users', obj).subscribe((r) => {

                this.rowData = r;
                  setTimeout(() => {  this.gridApi.sizeColumnsToFit(); }, 200);
             });




  }

  autoSizeAll() {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }



}

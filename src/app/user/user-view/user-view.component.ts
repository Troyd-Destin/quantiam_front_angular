import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit, OnDestroy {


  constructor(
  private fb: FormBuilder,
  private userService: UserService,
  private route: ActivatedRoute,
  private location: Location,
  public http: HttpClient,
 ) {

  this.renderUser = false;
  this.editUser = false;
 }

  @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;

  id: any;
  user: any = {};
  user$: any;
  userID: number;
  editUser = false;
  displayedColumnsSupervisors: string[] = ['id', 'name', 'title'];
  displayedColumnsPermissions: string[] = ['permission_id', 'permission_name', 'permission_description', 'derived_from_group', 'customColumn1'];
  displayedColumnsMachines: string[] = ['id', 'machine_name'];
  displayedColumnsRfid: string[] = ['id', 'string', 'customColumn1'];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  selectedTable = 'supervisors';
  permissionTableSource: any;
  rfidTableSource: any;
  renderUser = false;
  authedUser: any;

  private cellOldValue: any;

  private gridApi;
  private gridColumnApi;

  private rtoColumnDefs = [

    {headerName: 'Year', field: 'year',  width: 80, },
    {headerName: 'Vacation', field: 'vacation', editable: false, width: 120,  },
    {headerName: 'PTO', field: 'pto',  editable: false, width: 120,  },
    {headerName: 'PPL', field: 'ppl', hide: true,  },
    {headerName: 'Updated', field: 'updated_at',   },
    {

    field: 'created_at',
    headerName: 'Delete',
    editable: false,
    width: 100,
    cellStyle: function (params) {
      return {
        cursor: 'pointer'
      };
    },
    cellRenderer: function (params) {
      return '<button mat-button class="mat-button mat-warn" style="color:red;">Delete</button>';


    },
    onCellClicked: (params) => {

      this.deleteRtoAllotment(params);

    }  },

  ];

  private rtoDefaultColDef = {

  // maxWidth:120,
    cellStyle: function (params) {
      return {
        cursor: 'pointer',
      };
    },
    sortable: false,
    dragable: false,

  };

  ngOnInit() {




    this.route.params.subscribe(params => {

    this.id  = params.id;  // obtain ID from route
	  console.log(this.id);


     // get user data and store in user Variable
     this.userService.getAuthedUser().subscribe(res => {


          this.authedUser = res;

          if ( this.userService.hasPermission(27) || res.id === this.id ) {
            this.renderUser = true;
            this.userService.getUser(this.id);
            this.user$ = this.userService.user$.subscribe(r => {

              this.user = r;

              this.permissionTableSource = new MatTableDataSource<any>(r.permissions);
              this.permissionTableSource.paginator = this.paginator;
              this.permissionTableSource.sort = this.sort;

              this.rfidTableSource = new MatTableDataSource<any>(r.rfid);
            //  this.rfidTableSource = this.paginator;
            });

          }


        });


      });


      this.permissionChanges();

  }


  updateSupervisor(selectedSupervisorObj) {
    if ( confirm('are you sure?')) {
      console.log(selectedSupervisorObj);
      this.userService.changeSupervisor(this.user.id, selectedSupervisorObj.id).subscribe((r) => {


          this.user = r;

      });
    }

  }



  updateUser (obj) {

       this.userService.update(this.user.id, this.user).subscribe((r) => {

         this.location.replaceState('/user/' + r.employeeid);
         this.user.id = r.employeeid;
         this.user.employeeid = r.employeeid;

        });


  }

  deleteMachine(obj) {
    if (confirm('Are you sure to delete this permission?')) {

      // deletes machine association


    }
  }

  deletePermission(obj) {
    // Find index
    const index = this.permissionTableSource.data.findIndex(x => x.permission_id === obj.permission_id);

    // updated DB
    if (confirm('Are you sure to delete this permission?')) {
     this.userService.deletePermission(this.user.permissions[index].permissions_employees_id).subscribe((x) => {

      // Fix Table
      this.permissionTableSource.data.splice(index, 1);
      this.permissionTableSource.paginator = this.paginator;

      });
    }
  }



  deleteRfid(index) {
   // console.log(index);
   if (confirm('Are you sure to delete this card?')) {
    this.userService.deleteRfid(this.user.rfid[index].id).subscribe((x) => {

      this.rfidTableSource.data.splice(index, 1);
      this.rfidTableSource.paginator = this.paginator;

      console.log(this.rfidTableSource);

      });

    }
  }


  onRtoGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
	//  setTimeout(() => {  this.gridApi.sizeColumnsToFit(); }, 200);

  }


  onRtoCellEditingStarted(event) {
    console.log(event);
    this.cellOldValue = event.value;
  }


  onRtoCellEditingStopped(event) {

      const params = {};
    if (this.cellOldValue !== event.value) {
      params[event.colDef.field] = event.value;
      this.userService.updateRtoAllotment(event.data.entry_id, params).subscribe();
    }
  }


  permissionChanges() {


    console.log('permission pass');
    if (this.userService.hasPermission(37)) {

     // this.rtoColumnDefs[1].type = "numericColumn";
      this.rtoColumnDefs[1].editable = true;

    // this.rtoColumnDefs[2].type = "numericColumn";
      this.rtoColumnDefs[2].editable = true;
    }
  }

  createRtoAllotment()  {

    const params = {
      employee_id: this.user.id,
    };

    this.http.post<any>(environment.apiUrl + '/rto/allocation',params)
    .subscribe(response => {
      console.log(response);

      this.user.rto_allotment.unshift(response);
      this.gridApi.setRowData(this.user.rto_allotment);
    
    });

  }
  
  deleteRtoAllotment(row) {

   
    confirm('Do you want to delete this Allocation?')
    {
      this.http.delete<any>(environment.apiUrl + '/rto/allocation/'+row.data.entry_id).subscribe((r)=>{

          const index = this.user.rto_allotment.findIndex(obj => obj.entry_id === row.data.entry_id);
          console.log(index);
          this.user.rto_allotment.splice(index,1);
         
          this.gridApi.setRowData(this.user.rto_allotment);
      });
   }
  }


  ngOnDestroy() {
    if (this.user$) { this.user$.unsubscribe(); }


  }




}

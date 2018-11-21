import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import {MatPaginator, MatTableDataSource,MatSort} from '@angular/material';

import { FormBuilder, FormGroup }   from '@angular/forms';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
  
  id: any;
  user:any = {};
  user$: any;
  userID: number;
  editUser = false;
  displayedColumnsSupervisors: string[] = ['id', 'name','title'];
  displayedColumnsPermissions: string[] = ['permission_id', 'permission_name','permission_description','derived_from_group','customColumn1'];
  displayedColumnsMachines: string[] = ['id', 'machine_name'];
  displayedColumnsRfid: string[] = ['id', 'string','customColumn1'];
  pageSizeOptions: number[] = [5,10, 25, 100];
  selectedTable: string = 'supervisors';
  permissionTableSource: any;
  rfidTableSource: any;
  renderUser: boolean = false;
  authedUser: any;

  constructor(
  private fb: FormBuilder,
  private userService: UserService,
  private route: ActivatedRoute,
  private location: Location
 ) { 

  this.renderUser = false;
  this.editUser = false;
 }

  ngOnInit() {
  
    
    
    
    this.route.params.subscribe(params => {

    this.id  = params.id;  //obtain ID from route 
	  console.log(this.id);
    
    
     // get user data and store in user Variable
     this.userService.getAuthedUser().subscribe(res=>{
        
  
          this.authedUser = res;

          if( this.userService.hasPermission(27) || res.id == this.id ) //view yourself or if you have permission to view othres.
          {
            this.renderUser = true;
            this.userService.getUser(this.id); 
            this.user$ = this.userService.user$.subscribe(r=> { 
              
              this.user = r;
              
              this.permissionTableSource = new MatTableDataSource<any>(r.permissions);
              this.permissionTableSource.paginator = this.paginator;
              this.permissionTableSource.sort = this.sort;   
              
              this.rfidTableSource = new MatTableDataSource<any>(r.rfid);
            //  this.rfidTableSource = this.paginator;
            })

          }

    
        });
      
      
      });
   
  }


  updateSupervisor(selectedSupervisorObj)
  {
    if( confirm('are you sure?'))
    {
      console.log(selectedSupervisorObj);
      this.userService.changeSupervisor(this.user.id, selectedSupervisorObj.id);
    }

  }



  updateUser (obj){
        
       this.userService.update(this.user.id,this.user).subscribe((r)=>{ 

         this.location.replaceState("/user/"+r.employeeid);
         this.user.id = r.employeeid;
         this.user.employeeid = r.employeeid;

        }) 
  
  
  }
  
  deleteMachine(obj)
  {
    if(confirm("Are you sure to delete this permission?")) {

      //deletes machine association


    }
  }
  
  deletePermission(obj)
  {
    //Find index
    let index = this.permissionTableSource.data.findIndex(x=> x.permission_id === obj.permission_id);
    
    //updated DB
    if(confirm("Are you sure to delete this permission?")) {
     this.userService.deletePermission(this.user.permissions[index].permissions_employees_id).subscribe((x)=>{
      
      //Fix Table
      this.permissionTableSource.data.splice(index,1);
      this.permissionTableSource.paginator = this.paginator;
      
      }); 
    }
  }
  
  
  
  deleteRfid(index)
  {
   // console.log(index);
   if(confirm("Are you sure to delete this card?")) {
    this.userService.deleteRfid(this.user.rfid[index].id).subscribe((x)=>{
      
      this.rfidTableSource.data.splice(index,1);
      this.rfidTableSource.paginator = this.paginator;
       
      console.log(this.rfidTableSource);
      
      });

    }
  }
  
  ngOnDestroy()
  {
    if(this.user$) this.user$.unsubscribe();
  
    
  }

  
  
  
}

import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
  private fb: FormBuilder,
  private userService: UserService,
  private route: ActivatedRoute,
 ) { }

  ngOnInit() {
  
    this.id  = this.route.snapshot.params.id;  //obtain ID from route 
   console.log(this.id);
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
  
  
  updateUser (){
  
    
  
  
  }
  
  
  deletePermission(obj)
  {
    //Find index
    let index = this.permissionTableSource.data.findIndex(x=> x.permission_id === obj.permission_id);
    
    //updated DB
     this.userService.deletePermission(this.user.permissions[index].permissions_employees_id).subscribe((x)=>{
      
      //Fix Table
      this.permissionTableSource.data.splice(index,1);
      this.permissionTableSource.paginator = this.paginator;
      
      }); 
  }
  
  
  
  deleteRfid(index)
  {
   // console.log(index);
    this.userService.deleteRfid(this.user.rfid[index].id).subscribe((x)=>{
      
      this.rfidTableSource.data.splice(index,1);
      this.rfidTableSource.paginator = this.paginator;
       
      console.log(this.rfidTableSource);
      
      });
  }
  

  
  
  
}

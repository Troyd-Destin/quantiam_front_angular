import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';

import {MatPaginator, MatTableDataSource} from '@angular/material';

import { FormBuilder, FormGroup }   from '@angular/forms';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  user: {};
  user$: any;
  userID: number;
  editUser = false;
  displayedColumnsSupervisors: string[] = ['id', 'name','title'];
  displayedColumnsPermissions: string[] = ['permission_id', 'permission_name','derived_from_group','permission_description'];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  selectedTable: string = 'supervisors';
  permissionTableSource: any;

  constructor(
  private fb: FormBuilder,
  private userService: UserService,
  private route: ActivatedRoute 
  
 ) { }

  ngOnInit() {
  
    this.id  = this.route.snapshot.params.id;  //obtain ID from route 
   console.log(this.id);
     this.userService.getUser(this.id); 

    this.user$ = this.userService.user$.subscribe(r=> { 
      
      this.user = r;
      
      this.permissionTableSource = new MatTableDataSource<any>(r.permissions);
      this.permissionTableSource.paginator = this.paginator;
    })
      
      
      
   
  }
  
  
  updateUser (){
  
  
  
  
  }
  
  
  

  
  
  
}

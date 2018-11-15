import { Component, OnInit,Input,EventEmitter, Output } from '@angular/core';
import { SelectUserService } from './select-user.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {

  list$:any;
  items:any = [];
  allItems:any = [];
  showActive:boolean = true;
  showInactive:boolean = false;
  
  //Inputs 
  @Input() selectedValue:any = null; // default value, object or ID
  @Input() multiple:any = false; // multi version
  @Input() selectableGroup:any = false; // multi version
 
  //Outputs
  @Output() change = new EventEmitter<any>();
 

  constructor(private selectUserService:SelectUserService) { }

  ngOnInit() {

    this.selectUserService.list();
    this.list$ = this.selectUserService.list$.subscribe((r)=>{
      
          console.log(r);
          this.allItems = r;
         // if(r[0]) this.showItems();
      
      })
  }

}

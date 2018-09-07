import { Component, OnInit,Input,EventEmitter, Output } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.css']
})
export class SelectProjectComponent implements OnInit {

list$:any;
  items:any = [];
  allItems:any = [];
  showActive:boolean = true;
  showInactive:boolean = false;
 
 
  //Inputs 
  @Input() selectedValue:any = null; // default value, object or ID
  @Input() multiple:any = false; // multi version
  @Input() selectableGroup:any = false; // multi version
 
  @Output() change = new EventEmitter<any>();
 
  constructor(private projectService:ProjectService) { }

  ngOnInit() {
  
    //retrieve from project service
    //this.items = ['true', 'Two', 3,'test'];    
  
    this.projectService.list();
    this.list$ = this.projectService.list$.subscribe((r)=>{
      
      console.log(r);
          this.allItems = r;
          if(r[0]) this.showItems();
      
      })
  
  }

  showItems()
  {     
    console.log(this.showActive,this.showInactive);
  
    if(this.showActive && !this.showInactive)
      
    this.items = this.allItems.filter((obj)=>{   
  
        return obj.active;      
            
      }); 
      
    if(!this.showActive && this.showInactive)
      
    this.items = this.allItems.filter((obj)=>{   
  
        return !obj.active;      
            
      }); 
   
    
   if(!this.showActive && !this.showInactive) this.items = [];      
   if(this.showActive && this.showInactive)this.items = this.allItems;
      
  }
  
 
  onChange(event)
  {
     this.change.emit(event);  
  }
  
  ngOnDestroy()
  {
    this.list$ .unsubscribe();
  }
}

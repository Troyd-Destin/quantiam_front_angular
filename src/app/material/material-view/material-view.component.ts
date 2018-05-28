import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material/material.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, tap,delay } from 'rxjs/operators';
@Component({
  selector: 'app-material-view',
  templateUrl: './material-view.component.html',
  styleUrls: ['./material-view.component.css']
})
export class MaterialViewComponent implements OnInit {

  

  constructor(private material: MaterialService,private route: ActivatedRoute ) { }

  ngOnInit() {
    //console.log(this.route.params);
    let id; 
	this.route.params.subscribe(
		params => {
		
			id = params.id;
		} 
	);
	
   //  console.log(this.route.params);
    this.material.get(id).subscribe(
    
      res=>{
      
        this.material = res;
        console.log('Material Obj',res);
        
        }
    );
    
  }
  empty() {
    console.log('things');
  }
}

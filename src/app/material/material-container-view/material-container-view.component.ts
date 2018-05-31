import { Component, OnInit } from '@angular/core';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-container-view',
  templateUrl: './material-container-view.component.html',
  styleUrls: ['./material-container-view.component.css']
})
export class MaterialContainerViewComponent implements OnInit {

  _container = null;
  container = null;

  constructor(private materialLotCotainerService: MaterialLotContainerService,private route: ActivatedRoute ) { }

  ngOnInit() {
  
      let id  = this.route.snapshot.params.id;  //obtain ID from route   
       this.materialLotCotainerService.getMaterialLotContainer(id); 

      this.route.params.subscribe(val => {
         
        if(id != val.id){
          id = val.id;
           this.materialLotCotainerService.getMaterialLotContainer(id);

        }
      }); 
      
      console.log(id);
       // fetch the material belonging to this id
      
      this._container = this.materialLotCotainerService.materialLotContainer$.subscribe(res=> { //subscribe to the material service for updates
     
        if(typeof res !== 'undefined') this.container = res;
        console.log(this._container, res);
       
       });
    
    
    
    
    
  }

  
  ngOnDestroy()
  {
    this._container.unsubscribe();
    
  }
  
}

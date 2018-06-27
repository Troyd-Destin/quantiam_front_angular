import { Component, OnInit } from '@angular/core';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import { MaterialLotService } from '../../services/material-lot/material-lot.service';
import { MaterialService } from '../../services/material/material.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-container-view',
  templateUrl: './material-container-view.component.html',
  styleUrls: ['./material-container-view.component.css']
})
export class MaterialContainerViewComponent implements OnInit {

  _container = null;
  container = null;
  editMaterial = false;
  editLot = false;
  editContainer = false;
  test_selector = null;
  newLotCreated = false;

  constructor(
	private materialLotCotainerService: MaterialLotContainerService,
	private materialService: MaterialService, 
	private materialLotService: MaterialLotService, 
	private route: ActivatedRoute 
	
	) { }

  ngOnInit() {
  
      let id  = this.route.snapshot.params.id;  //obtain ID from route   
      this.materialLotCotainerService.getMaterialLotContainer(id); 

      this.route.params.subscribe(val => {
         // console.log(val);
		 
		  if(val.scannerNavigation && val.id) this.materialLotCotainerService.update({active:1},val.id).subscribe();

		 
        if(id != val.id){
          id = val.id;
           this.materialLotCotainerService.getMaterialLotContainer(id);
		   
		  
		   
		  
        }
      }); 
	  
      this._container = this.materialLotCotainerService.materialLotContainer$.subscribe(res=> { //subscribe to the material service for updates
     
        if(typeof res !== 'undefined') {
			this.container = res;
			
		}
       });
  }
  
  ngOnDestroy()
  {
    this._container.unsubscribe(); 
  }
  
  updateContainerField(field){
        var params = {};
        params[field.name] =  field.value;
        this.materialLotCotainerService.update(params).subscribe((r)=>{console.log(r)});      
  }
  
  changeContainerStatus()
  {
		var params = {};
        params['active'] =  this.container.active;
        this.materialLotCotainerService.update(params).subscribe();  
  }
  
  updateMaterial(field){
	   
    var params = {};
    params[field.name] =  field.value;
    this.materialService.updateMaterial(params,this.container.lot.material.id);
  
  }
  
  changedLot(obj)
  {
	let lot_obj = obj.data[0];
	
	console.log(lot_obj);
	if(lot_obj.isNew)
		{
				//trigger some sort of confirm popup
				if(window.confirm("Are you sure you want to create '"+lot_obj.text+"' ?")) {
						
						let params = {'lot_name':lot_obj.text,'material_id':this.container.lot.material.id};
						this.createMaterialLot(params);
						
					  }
			
			return;
		}
		
	let payload = {'lot_id':lot_obj.id,'lot':true};
	console.log(payload);
	this.materialLotCotainerService.update(payload);
		
  
  }
  
  createMaterialLot(obj)
  {
	console.log(obj);
	this.materialLotService.create(obj).subscribe((r)=>{
		
			console.log(r);
			this.newLotCreated = true;		
			let payload = {'lot_id':r.id,'lot':true};
			this.materialLotCotainerService.update(payload);
		
			
		});
	
  }
  
  
  
  
}

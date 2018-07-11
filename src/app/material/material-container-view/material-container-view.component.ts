import { Component, OnInit } from '@angular/core';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import { MaterialLotService } from '../../services/material-lot/material-lot.service';
import { MaterialService } from '../../services/material/material.service';
import { MaterialSupplierService } from '../../services/material-supplier/material-supplier.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-container-view',
  templateUrl: './material-container-view.component.html',
  styleUrls: ['./material-container-view.component.css']
})
export class MaterialContainerViewComponent implements OnInit {

  _container = null;
  container: any;
  editMaterial = false;
  editLot = false;
  editContainer = false;
  test_selector = null;
  newLotCreated = false;
  scannerNavigation:any;
  fetched = false;
  
  
  locationList = [
	  
	  {id:2,text:"Acids Cabinet (Research)"},
	  {id:3,text:"Buto/Etho Oxides"},
	  {id:4,text:"Explosives Cabinet (Research) "},
	  {id:5,text:"Fridge(Research)"},
	  {id:6,text:"General Compounds"},
	  {id:7,text:"Metals"},
	  {id:8,text:"Oxidizing Compounds"},
	  {id:9,text:"South Wall Shelves"},
	  
	  ];

  constructor(
	private materialLotCotainerService: MaterialLotContainerService,
	private materialService: MaterialService, 
	private materialLotService: MaterialLotService, 
	private materialSupplierService: MaterialSupplierService, 
	private route: ActivatedRoute 
	
	) { }

  ngOnInit() {
  
      let id  = this.route.snapshot.params.id;  //obtain ID from route   
	 
      this.materialLotCotainerService.getMaterialLotContainer(id); 

      this.route.params.subscribe(val => {
		 
        if(id != val.id){
          id = val.id;
           this.materialLotCotainerService.getMaterialLotContainer(id);
		   
		  
        }
      }); 
	  
	  this.route.queryParams.subscribe((p:any)=>{
	  
			
			  this.scannerNavigation = p['scannerNavigation'];
			
	  });
	  
      this._container = this.materialLotCotainerService.materialLotContainer$.subscribe(res=> { //subscribe to the material service for updates
     
	 console.log(res);
		this.fetched = true;
        if(typeof res !== 'undefined') {
			this.container = res;
			
			if(this.scannerNavigation && this.container.id && !this.container.active) this.materialLotCotainerService.update({active:1},this.container.id).subscribe((r)=>{ this.container.active = true;});
			
			
			//console.log(moment(this.container.container_opened).format("YYYY-MM-DDTHH:mm:ss.SSS")+'Z');
			
			//Need to find a better way of translating this
			if(this.container.container_received) this.container.container_received = moment(this.container.container_received).format("YYYY-MM-DDTHH:mm:ss.SSS")+'Z';
			if(this.container.container_opened) this.container.container_opened = moment(this.container.container_opened).format("YYYY-MM-DDTHH:mm:ss.SSS")+'Z';
			
			
			
			  this.editMaterial = false;
			  this.editLot = false;
			  this.editContainer = false;
		}
	  }, (error:any)=>{  
	  console.log('test');
	  this.fetched = false;
		this.container = {};
	  
	  });
  }
  
  ngOnDestroy()
  {
    this._container.unsubscribe(); 
  }
  
  updateContainerField(field,specific_field){
		
        var params = {};
        if(specific_field) {
			params[specific_field] = field;
		
		}else{ params[field.name] =  field.value; }
        this.materialLotCotainerService.update(params).subscribe((r)=>{console.log(r)});      
  }
  
  changeContainerStatus()
  {
		var params = {};
        params['active'] =  this.container.active;
        this.materialLotCotainerService.update(params).subscribe();  
  }
  
  updateMaterial(field){
	   
    let params = {};
    params[field.name] =  field.value;
	params['supplier'] = true;
    this.materialService.updateMaterial(params,this.container.lot.material.id).subscribe((r)=>{  this.container.lot.material = r;   });
  
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
	this.materialLotCotainerService.update(payload).subscribe();
		
  
  }
  
  createMaterialLot(obj)
  {
	
	this.materialLotService.create(obj).subscribe((r)=>{
		
			
			this.newLotCreated = true;		
			let payload = {'lot_id':r.id,'lot':true};
			this.materialLotCotainerService.update(payload).subscribe();
		
			
		});
	
  }
  
  changedSupplier(obj)
  {
	let supplier_obj = obj.data[0];
	
	console.log(supplier_obj);
	if(supplier_obj.isNew)
		{
				//trigger some sort of confirm popup
				if(window.confirm("Are you sure you want to create '"+supplier_obj.text+"' ?")) {
						
						let params = {'supplier_name':supplier_obj.text};
						this.createMaterialSupplier(params);
						
					  }
			
			return;
		}
		
	let payload = {'supplier_id':supplier_obj.id,'supplier':true};
	 this.materialService.updateMaterial(payload,this.container.lot.material.id).subscribe((r)=>{  this.container.lot.material = r;   });
  
  
  }
  
  createMaterialSupplier(obj)
  {
	console.log(obj);
	this.materialSupplierService.create(obj).subscribe((r)=>{
		
			console.log(r);	
			let payload = {'supplier_id':r.id,'supplier':true};
			this.materialService.updateMaterial(payload,this.container.lot.material.id).subscribe((r)=>{  this.container.lot.material = r;   });
		
			
		});
	
  }
  
  
  
}

import { Component, OnInit,Inject } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormBuilder, FormGroup }   from '@angular/forms';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import { MaterialLotService } from '../../services/material-lot/material-lot.service';
import { MaterialService } from '../../services/material/material.service';

import { WebsocketService } from '../../services/websocket/websocket.service'; 
import { Router } from '@angular/router';



@Component({
  selector: 'app-material-creation-dialog',
  templateUrl: './material-creation-dialog.component.html',
  styleUrls: ['./material-creation-dialog.component.css'],
   providers: [],
})
export class MaterialCreationDialogComponent implements OnInit {

    form: FormGroup;
    description:string;
    newMaterial: boolean = false;
    selectedMaterial = {};
    selectedLot = {};
    materialStepComplete = false;
	codeRegistryStep = false;
	materialCreationStep = true;
    creatingMaterial = false;
    newLot = {};
	container = {};
	material = {};
    lot = {};
	_ws;
   
   
   
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MaterialCreationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
		private materialLotContainerService: MaterialLotContainerService,
		private materialService: MaterialService, 
		private materialLotService: MaterialLotService, 
		private websocket: WebsocketService,
		public router: Router, 
		
		) {  }

    ngOnInit() {
	
	
        this.form = this.fb.group({
            description: [this.description, []],
           
        });
		
		
		
		this.websocket.redirectOnScan = false;
		
		 this._ws = this.websocket.observable.subscribe((r)=>{
		
		//console.log('dialog');
				if(this.codeRegistryStep && r.type == 'Scanner')
				{
					//take scanned data and add it to the container.
					this.container.qcid = r.data;
				}
			
		 });
		 
    }
	
	
	
	

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
    
    
    selectMaterial(obj){
      
        
        this.selectedMaterial = obj.data[0];
        this.lot = {};
        this.selectedLot = {};
        this.materialStepComplete = false;
        
        if(this.selectedMaterial.id) 
        {
          this.materialStepComplete = true;
          this.material = this.selectedMaterial;
        }
        else
        {
          this.materialStepComplete = false;
          this.material = {};
        }
        console.log(this.selectedMaterial);
      
      }
      
     createMaterialAttrs()
     {
       this.newMaterial = !this.newMaterial; 
       this.material = {};
       this.lot = {};
       this.creatingMaterial = true;
     
     }
     
     selectingMaterialAttrs()
     {
       this.creatingMaterial = false;
       this.newMaterial = !this.newMaterial; 
     }
     
     selectLot(obj)
     {
		if(obj.data[0].selected == false)
		{
			 this.selectedLot = obj.data[0];  
			 this.lot = this.selectedLot;
		}
		else
		{
			this.selectedLot = {};
			this.lot = {};
		}
       
       
        //console.log('Select Lot',obj,this.selectedLot);
		
       // this.lot = this.selectedLot;
        
     }
	 
	 newLotname()
	 {
		this.lot = this.newLot;
		this.lot.isNew = true;
	 setTimeout(function(){$('#container_denomination').focus();},300);
	 
	 }
	 
	 
	 updateQCID(field)
	 {
		var params = {};
        params[field.name] =  field.value;
		if(this.container.id) this.materialLotContainerService.update(params,this.container.id).subscribe((r)=>{
			
			
					this.close();
					this.router.navigate('/material/container/'+this.container.id);
			
			});
	 
	 }
	 
	updateContainer(field)
	{
		var params = {};
        params[field.name] =  field.value;
		if(this.container.id) this.materialLotContainerService.update(params,this.container.id).subscribe();	
	}
	
	 validateNewMaterial()
	 {
	 if(this.material.name){ 
		 this.materialStepComplete = true;
		 this.lot.isNew = true;
		 } else {
		 
			this.materialStepComplete = false;
			this.lot.isNew = false;
		 }
	 }
	 
	 validateForm()
	 {
		if(!this.material.name) return false;
		if(!this.lot.lot_name) return false;
		if(!this.container.denomination || !this.container.gross_weight || !this.container.amount_ordered) return false;
	 
		return true;
	 }
	 
	 
	 createButton(){
		
	
		// If therre is a new lot and container
		if(this.creatingMaterial && this.lot.isNew){ 
				this.materialService.create(this.material).subscribe((response)=>{
					
							console.log(response);
							this.lot.slip_material_id = response.id;
							
							this.materialLotService.create(this.lot).subscribe((response) => {
								
										console.log(response);
										this.container.lot_id = response.id;
										this.materialLotContainerService.create(this.container).subscribe((response)=>{
											
											this.container = response;
											this.codeRegistryStep = true;
											this.materialCreationStep = false;
											setTimeout(function(){$('#qcid_entry').focus()},1000);
											
											});
										
								
								});
					
					});
					
			return;
				
		};
		
		//if there is only a new lot 
		if(!this.creatingMaterial && this.lot.isNew){ 
				
							this.lot.slip_material_id = this.material.slip_material_id;
							
							this.materialLotService.create(this.lot).subscribe((response) => {
								
										console.log(response);
										this.container.lot_id = response.id;
										this.materialLotContainerService.create(this.container).subscribe((response)=>{
											
											this.container = response;
											this.codeRegistryStep = true;
											this.materialCreationStep = false;
											setTimeout(function(){$('#qcid_entry').focus()},1000);
											
											});
										
								
								});
					
			return;
				
		};
		
		///// Only new container.
		this.container.lot_id = this.lot.id;
		this.materialLotContainerService.create(this.container).subscribe((response)=>{

			this.container = response;
			this.codeRegistryStep = true;
			this.materialCreationStep = false;
			setTimeout(function(){$('#qcid_entry').focus()},1000);


		});
		return;
		//if(!this.creatingMaterial && this.lot.isNew) this.createLot();
		
		
	//	this.createContainer();
		
	 
	 }
	 
	 
	  ngOnDestroy()
		  {
			this.websocket.redirectOnScan = true;
			this._ws.unsubscribe();	
  
		  }

}

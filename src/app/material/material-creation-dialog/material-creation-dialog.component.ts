import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import { MaterialLotService } from '../../services/material-lot/material-lot.service';
import { MaterialService } from '../../services/material/material.service';
import { MaterialLotContainerDatatableService } from '../services/material-lot-container-datatable.service';

import { LocationService } from '../../services/location/location.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { Router } from '@angular/router';

import * as _moment from 'moment';


@Component({
  selector: 'app-material-creation-dialog',
  templateUrl: './material-creation-dialog.component.html',
  styleUrls: ['./material-creation-dialog.component.css'],
   providers: [],
})

export class MaterialCreationDialogComponent implements OnInit, OnDestroy {


	lookedForMaterial = false;
    form: FormGroup;
    description: string;
    newMaterial = false;
    selectedMaterial: any = {};
    selectedLot: any = {};
    materialStepComplete = false;
	codeRegistryStep = false;
	materialCreationStep = true;
    creatingMaterial = false;
    newLot: any = {};
	container: any = {};
	material: any = {};
    lot: any = {};
	_ws;
	_wsk;


   // Temporary until we link to DB
   locationList: any;

	// @Output() refreshContainerTable = new EventEmitter();


    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MaterialCreationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
		private materialLotContainerService: MaterialLotContainerService,
		private materialService: MaterialService,
		private materialLotService: MaterialLotService,
		private websocket: WebsocketService,
		public router: Router,
		private materialLotContainerDatatable: MaterialLotContainerDatatableService,
		private locationService: LocationService,

		) {  }

    ngOnInit() {


        this.form = this.fb.group({
            description: [this.description, []],

        });



		this.websocket.redirectOnScan = false;

		 this._ws = this.websocket.observable.subscribe((r) => {

		// console.log('dialog');
				if (this.codeRegistryStep && r.type === 'Scanner') {
					// take scanned data and add it to the container.
					this.container.qcid = r.data;
				}

		 });

		 this._wsk = this.websocket.keyboardObservable.subscribe((r) => {

		// console.log('dialog');
				if (this.codeRegistryStep) {
					// take scanned data and add it to the container.
					this.container.qcid = r.data;
				}

		 });

		 this.locationService.getList();
		 this.fetchLocationList();

	}

	fetchLocationList() {
		this.locationService.list$.subscribe((r) => {

				this.locationList = r;
		});

	}




    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }


    selectMaterial(obj) {


        this.selectedMaterial = obj;
        this.lot = {};
        this.selectedLot = {};
        this.materialStepComplete = false;

        if (this.selectedMaterial && this.selectedMaterial.id) {
          this.materialStepComplete = true;
          this.material = this.selectedMaterial;
        } else {
          this.materialStepComplete = false;
          this.material = {};
        }
      //  console.log(this.selectedMaterial);

      }


	  selectSupplier(obj) {

				
					if(typeof(obj) !== 'undefined'){
          	this.material.supplier_id = obj.supplier_id;
					}


      }

     createMaterialAttrs() {
       this.newMaterial = !this.newMaterial;
       this.material = {};
       this.lot = {};
       this.creatingMaterial = true;

     }

     selectingMaterialAttrs() {
       this.creatingMaterial = false;
       this.newMaterial = !this.newMaterial;
     }

     selectLot(obj) {
		if (obj.data[0].selected === false) {
			 this.selectedLot = obj.data[0];
			 this.lot = this.selectedLot;
		} else {
			this.selectedLot = {};
			this.lot = {};
		}


        // console.log('Select Lot',obj,this.selectedLot);

       // this.lot = this.selectedLot;

     }

	 newLotname() {
		this.lot = this.newLot;
		this.lot.isNew = true;
	 setTimeout(function() {$('#container_denomination').focus(); }, 300);

	 }


	 updateQCID(field) {
		const params = {};

        params['qcid'] =  this.container.qcid;

		 if (this.container.id) { this.materialLotContainerService.update(params, this.container.id).subscribe((r) => {


					this.close();
					// this.router.navigate('/material/container/'+this.container.id);

			});
			}

	 }

	updateContainer(field) {
		const params = {};
        params[field.name] =  field.value;
		if (this.container.id) { this.materialLotContainerService.update(params, this.container.id).subscribe(); }
	}

	 validateNewMaterial() {
	 if (this.material.name) {
		 this.materialStepComplete = true;
		 this.lot.isNew = true;
		 } else {

			this.materialStepComplete = false;
			this.lot.isNew = false;
		 }
	 }

	 validateForm() {
		if (!this.material.name) { return false; }
		if (!this.lot.lot_name) { return false; }
		if (!this.container.denomination  || !this.container.amount_ordered || !this.container.location_id) { return false; }
	 // || !this.container.gross_weight
		return true;
	 }


	 createButton() {


		// If therre is a new lot and container
		if (this.creatingMaterial && this.lot.isNew) {
				this.materialService.create(this.material).subscribe((response) => {

							console.log(response);
							this.lot.slip_material_id = response.id;

							this.materialLotService.create(this.lot).subscribe((lot_response) => {

										console.log(lot_response);
										this.container.lot_id = lot_response.id;
										this.materialLotContainerService.create(this.container).subscribe((container_response) => {

											this.container = container_response;
											this.codeRegistryStep = true;
											this.materialCreationStep = false;
											setTimeout(function() {$('#qcid_entry').focus(); }, 1000);

											});


								});

					});

			return;

		}

		// if there is only a new lot
		if (!this.creatingMaterial && this.lot.isNew) {

							this.lot.slip_material_id = this.material.slip_material_id;

							this.materialLotService.create(this.lot).subscribe((response) => {

									
										this.container.lot_id = response.id;
										if(this.container.container_received){ this.container.container_received = _moment(this.container.container_received).format('YYYY-MM-DD'); }
								//		console.log(this.container);
										this.materialLotContainerService.create(this.container).subscribe((container) => {

											this.container = container;
											this.codeRegistryStep = true;
											this.materialCreationStep = false;
											setTimeout(function() {$('#qcid_entry').focus(); }, 1000);

											});


								});

			return;

		}

		///// Only new container.
		this.container.lot_id = this.lot.id;
		if(this.container.container_received){ this.container.container_received = _moment(this.container.container_received).format('YYYY-MM-DD'); }
		console.log(this.container);
		this.materialLotContainerService.create(this.container).subscribe((response) => {

			this.container = response;
			this.codeRegistryStep = true;
			this.materialCreationStep = false;
			setTimeout(function() {$('#qcid_entry').focus(); }, 1000);


		});
		return;
		// if(!this.creatingMaterial && this.lot.isNew) this.createLot();


	// 	this.createContainer();


	 }


	  ngOnDestroy() {

		 //  this.materialLotContainerDatatable.getMaterialLotContainerDatatable({draw:1,length:20, start:0},true);
			this.websocket.redirectOnScan = true;
			this._ws.unsubscribe();
			this._wsk.unsubscribe();

		  }

}

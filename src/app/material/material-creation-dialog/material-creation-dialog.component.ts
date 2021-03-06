import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import { MaterialLotService } from '../../services/material-lot/material-lot.service';
import { MaterialService } from '../../services/material/material.service';
import { MaterialLotContainerDatatableService } from '../services/material-lot-container-datatable.service';
import { MatStepper } from '@angular/material/stepper';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { LocationService } from '../../services/location/location.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

import { MatDialog } from '@angular/material/dialog'; 

import { MaterialHazardSymbolSelectorComponent } from '../material-hazard-symbol-selector/material-hazard-symbol-selector.component';


import * as _moment from 'moment';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-material-creation-dialog',
    templateUrl: './material-creation-dialog.component.html',
    styleUrls: ['./material-creation-dialog.component.css'],
    providers: [],
})

export class MaterialCreationDialogComponent implements OnInit, OnDestroy {

    isLinear = true;
    materialFormGroup: FormGroup;
    lotFormGroup: FormGroup;
    containerFormGroup: FormGroup;
    sdsFormGroup: FormGroup;
    qcidFormGroup: FormGroup;



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
    material: any = {whmis_hazard_symbols: []};
    lot: any = {};
    today = new Date();
    hideNewLot = false;
    isWeight = false;
    containersToMake = 0;
    createdContainers = [];
    loadQcidTable = false;
	files = [];
	stuffCreated = false;

    sdsBlob;
    showSDS = false;
    showSDSError = false;
    SDSurl;


    _ws;
    _wsk;


    // Temporary until we link to DB
    locationList: any;

    // @Output() refreshContainerTable = new EventEmitter();


    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef < MaterialCreationDialogComponent > ,
        @Inject(MAT_DIALOG_DATA) data,
        private materialLotContainerService: MaterialLotContainerService,
        private materialService: MaterialService,
        private materialLotService: MaterialLotService,
        private websocket: WebsocketService,
        public router: Router,
        private materialLotContainerDatatable: MaterialLotContainerDatatableService,
        private locationService: LocationService,
        private _formBuilder: FormBuilder,
        private notification: NotificationsService,
		private http: HttpClient,
		public dialog: MatDialog,
    ) {}

    ngOnInit() {


        this.materialFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.lotFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
        this.containerFormGroup = this._formBuilder.group({
            thirdCtrl: ['', ],
            thirdCtrl2: ['', Validators.required],
            thirdCtrl3: ['', Validators.required],
            thirdCtrl4: ['', Validators.required],
            thirdCtrl5: ['', Validators.required],
            thirdCtrl6: ['', Validators.required],
            thirdCtrl7: ['', ],
            thirdCtrl8: ['', ],
        });

        this.sdsFormGroup = this._formBuilder.group({
			fourthCrtl: ['', Validators.required],

        });

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

		if(!this.stuffCreated)
		{
		Swal.fire({
            title: 'Are you sure?',
            text: 'This action will lose your container progress.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, this is okay',
        }).then((result) => {

				this.dialogRef.close();
		
		});
		}
		else
		{
			this.dialogRef.close();
		}
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
		
		if(obj.sds)
		{
			console.log('triggered');
			this.fetchSDS();
		}

    }


    selectSupplier(obj) {


        if (typeof(obj) !== 'undefined') {
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
            this.newLot.lot_name = 'eee';
            this.hideNewLot = true;
        } else {
            this.selectedLot = {};
            this.lot = {};
            this.newLot = {};
            this.hideNewLot = false;
        }

    }

    newLotname(event) {
        // console.log(event);

        this.lot = this.newLot;
        this.lot.isNew = true;

        if (!this.newLot.lot_name) { this.lot.isNew = false; }


        /// setTimeout(function() {$('#container_denomination').focus(); }, 300);

    }


    updateQCID(container) {
        const params = {};

        params['qcid'] = container.qcid;

        if (container.id) {
            this.materialLotContainerService.update(params, container.id).subscribe((r) => {


                // 	this.close();
                // this.router.navigate('/material/container/'+this.container.id);

            });
        }

    }

    updateContainer(field) {
        const params = {};
        params[field.name] = field.value;
        if (this.container.id) { this.materialLotContainerService.update(params, this.container.id).subscribe(); }
	}
	
	updateMaterialSDSRevision() {
	
		const params:any = {};
		console.log(params);
        params.sds_revision_date = _moment(this.material.sds_revision_date).format('YYYY-MM-DD');
        if (this.material.id) { this.materialService.update(params, this.material.id).subscribe(); }
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
        // if (!this.material.name) { return false; }
        // 	if (!this.lot.lot_name) { return false; }
        // 	if (!this.container.denomination  || !this.container.amount_ordered || !this.container.location_id) { return false; }
        // || !this.container.gross_weight
        // 	return true;
        return;

    }

    updateCalculatedTare() {
        setTimeout((x) => {

            const substrings = ['kg', 'KG'];

            if (new RegExp(substrings.join('|')).test(this.container.denomination) && this.container.amount_ordered < 10) {
                // At least one match
                this.isWeight = true;
                this.container.calculated_tare = this.container.gross_weight - (this.container.amount_ordered * 1000);
                return true;
            } else {
                this.container.calculated_tare = this.container.gross_weight - this.container.amount_ordered;
                return true;
            }
        }, 200);
    }


    createButton(stepper) {
        Swal.fire({
            title: 'Creating Container',
            text: 'This action will create ' + this.containersToMake + ' container(s) of ' + this.material.name,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, I want this.'
        }).then((result) => {
            for (let index = 0; index < this.containersToMake; index++) {
                this.createAllTheStuff();
            }
			this.goForward(stepper);
			this.stuffCreated = true;
        });

    }

    createAllTheStuff() {
        if (this.creatingMaterial && this.lot.isNew) {
            this.materialService.create(this.material).subscribe((response) => {
                this.lot.slip_material_id = response.id;

                this.materialLotService.create(this.lot).subscribe((lot_response) => {

                    console.log(lot_response);
                    this.container.lot_id = lot_response.id;
                    this.materialLotContainerService.create(this.container).subscribe((container) => {
                        this.createdContainers.push(container);
                        console.log(this.createdContainers);
                        this.container = container;
                        this.codeRegistryStep = true;
                        this.materialCreationStep = false;
                        this.createdContainers = this.createdContainers;
                    });
                });
            });
            return;

        }
        if (!this.creatingMaterial && this.lot.isNew) {
            this.lot.slip_material_id = this.material.slip_material_id;
            this.materialLotService.create(this.lot).subscribe((response) => {
                this.container.lot_id = response.id;
                if (this.container.container_received) { this.container.container_received = _moment(this.container.container_received).format('YYYY-MM-DD'); }

                this.materialLotContainerService.create(this.container).subscribe((container) => {
                    this.createdContainers.push(container);
                    this.createdContainers = this.createdContainers;
                    console.log(this.createdContainers);
                    this.container = container;
                    this.codeRegistryStep = true;
                    this.materialCreationStep = false;
                });
            });
            return;

        }

        ///// Only new container.
        this.container.lot_id = this.lot.id;
        if (this.container.container_received) { this.container.container_received = _moment(this.container.container_received).format('YYYY-MM-DD'); }
        console.log(this.container);
        this.materialLotContainerService.create(this.container).subscribe((response) => {
            this.createdContainers.push(response);
            this.createdContainers = this.createdContainers;
            console.log(this.createdContainers);
            this.container = response;
            this.codeRegistryStep = true;
            this.materialCreationStep = false;


        });
        return;

    }

    checkIfWeight() {
        this.isWeight = false;
        const substrings = ['g', 'kg', 'KG', 'ml', 'L', 'l'];

        if (new RegExp(substrings.join('|')).test(this.container.denomination)) {
            this.isWeight = true;

            return true;
        }
        return false;
    }

    goForward(stepper: MatStepper) {
        stepper.next();
    }

    goBack(stepper: MatStepper) {
        stepper.previous();
    }




    /*** File Drop ***/

    public dropped(files: NgxFileDropEntry[]) {
        // this.files = event.files;
        for (const droppedFile of files) {

            if (droppedFile.fileEntry.isFile) { // is it a file?
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    // You could upload it like this:
                    const formData = new FormData();
                    formData.append('sds', file, 'test.pdf');

                    // Headers
                    const headers = new HttpHeaders({

                    });

                    this.http.post(environment.apiUrl + '/material/' + this.material.id + '/sds', formData, { headers: headers })
                        .subscribe(response => {

                                this.material = response;
                                this.files = [];
                                this.fetchSDS();
                            },
                            error => {
                                this.notification.error('Error', error.error.error, { showProgressBar: false, timeOut: 5000, clickToClose: true });
                                this.files = [];
                            });


                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                this.notification.error('Error', 'You can only upload a pdf file.', { showProgressBar: false, timeOut: 3000, clickToClose: true });
                this.files = [];

            }
        }
    }

    public fileOver(event) {
        console.log(event);
    }

    public fileLeave(event) {
        console.log(event);
    }


    fetchSDS() {

        if (this.showSDS) { this.showSDS = false; }

        this.http.get(environment.apiUrl + '/material/' + this.material.id + '/sds?filterSpinner', { responseType: 'blob' }).subscribe((response) => {

            this.sdsBlob = response;
            this.showSDS = true;
            this.showSDSError = false;
            this.SDSurl = window.URL.createObjectURL(response);
            const ifr = document.getElementById('iframe') as HTMLIFrameElement;

            if (ifr) {
                ifr.contentWindow.location.replace(this.SDSurl);
            }

        }, (error) => {
            this.showSDS = false;
            this.showSDSError = true;
            this.notification.error('Problem', 'There was an issue trying to display the SDS.', { showProgressBar: false, timeOut: 5000, clickToClose: true });


        });

    }

	openHazardDialog(): void {
		const dialogRef = this.dialog.open(MaterialHazardSymbolSelectorComponent, {
		  width: '80vw',
		  position: {bottom:'50px'},
		  data: this.material
		});
	
		dialogRef.afterClosed().subscribe(result => {
		  console.log('The dialog was closed');
		  this.material = result;
		});
	  }


    ngOnDestroy() {

        //  this.materialLotContainerDatatable.getMaterialLotContainerDatatable({draw:1,length:20, start:0},true);
        this.websocket.redirectOnScan = true;
        this._ws.unsubscribe();
        this._wsk.unsubscribe();

    }

}
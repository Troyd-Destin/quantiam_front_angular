import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import { MaterialLotService } from '../../services/material-lot/material-lot.service';
import { MaterialService } from '../../services/material/material.service';
import { MaterialSupplierService } from '../../services/material-supplier/material-supplier.service';
import { LocationService } from '../../services/location/location.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

import { HttpClient,  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-material-container-view',
  templateUrl: './material-container-view.component.html',
  styleUrls: ['./material-container-view.component.css']
})



export class MaterialContainerViewComponent implements OnInit, OnDestroy {

  _container = null;
	container: any;
	canEdit = false;
  editMaterial = false;
  editLot = false;
  editContainer = false;
  test_selector = null;
  newLotCreated = false;
  scannerNavigation: any;
	fetched = false;
	sdsSearch = [];
	searchingPossibleSDS = false;
	
	MsdsSearch = {

		action: 'search',
		hostName: 'chemicalsafety.com',
		isContains: 1,
		p1: 'MSMSDS.COMMON|',  // Chemical name lowercase
		p2: 'MSMSDS.MANUFACT|', // Manufactuer
		p3: 'MSCHEM.CAS|',  // CAS
	}


  locationList: any;

  constructor(
	private materialLotCotainerService: MaterialLotContainerService,
	private materialService: MaterialService,
	private materialLotService: MaterialLotService,
	private materialSupplierService: MaterialSupplierService,
	private route: ActivatedRoute,
	private locationService: LocationService,
	private router: Router,
	private userService: UserService,
	private http: HttpClient,

	) { }

  ngOnInit() {

		if (this.userService.hasPermission([40, 41])) { this.canEdit = true; }


		let id  = this.route.snapshot.params.id;  // obtain ID from route

		
    
		
			
			this.route.queryParams.subscribe((p: any) => {


					this.scannerNavigation = p['scannerNavigation'];


			});

      this._container = this.materialLotCotainerService.getMaterialLotContainer(id).subscribe(res => { // subscribe to the material service for updates

		 console.log(res);

		
			this.fetched = true;
			if (typeof res !== 'undefined') {

			this.container = res;
			if(typeof res.lot !== 'undefined'){

				this.fetchPotentialMSDS();

			}

			if (this.scannerNavigation && this.container.id && !this.container.active) { this.materialLotCotainerService.update({active: 1}, this.container.id).subscribe((r) => { this.container.active = true; }); }


			// console.log(moment(this.container.container_opened).format("YYYY-MM-DDTHH:mm:ss.SSS")+'Z');

			// Need to find a better way of translating this
			if (this.container.container_received) { this.container.container_received = moment(this.container.container_received).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'; }
			if (this.container.container_opened) { this.container.container_opened = moment(this.container.container_opened).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'; }



			  this.editMaterial = false;
			  this.editLot = false;
			  this.editContainer = false;
		}
	  }, (error: any) => {
	  console.log('test');
	  this.fetched = false;
		this.container = {};

	  });


		this.locationService.getList();
		this.fetchLocationList();

	}

  ngOnDestroy() {
    this._container.unsubscribe();
  }

	fetchLocationList() {
		this.locationService.list$.subscribe((r) => {



				this.locationList = r;




		});


	}

  updateContainerField(field, specific_field) {

        const params = {};
        if (specific_field) {
			params[specific_field] = field;

		} else { params[field.name] =  field.value; }
        this.materialLotCotainerService.update(params).subscribe((r) => {console.log(r); });
  }

  changeContainerStatus() {
		const params = {};
        params['active'] =  this.container.active;
        this.materialLotCotainerService.update(params).subscribe();
  }

  updateMaterial(field) {

    const params = {};
    params[field.name] =  field.value;
	params['supplier'] = true;
    this.materialService.updateMaterial(params, this.container.lot.material.id).subscribe((r) => {  this.container.lot.material = r;   });

  }

  changedLot(obj) {
	const lot_obj = obj.data[0];

	console.log(lot_obj);
	if (lot_obj.isNew) {
				// trigger some sort of confirm popup
				if (window.confirm('Are you sure you want to create \'' + lot_obj.text + '\' ?')) {

						const params = {'lot_name': lot_obj.text, 'material_id': this.container.lot.material.id};
						this.createMaterialLot(params);

					  }

			return;
		}

	const payload = {'lot_id': lot_obj.id, 'lot': true};
	console.log(payload);
	this.materialLotCotainerService.update(payload).subscribe();


  }

  createMaterialLot(obj) {

	this.materialLotService.create(obj).subscribe((r) => {


			this.newLotCreated = true;
			const payload = {'lot_id': r.id, 'lot': true};
			this.materialLotCotainerService.update(payload).subscribe();


		});

  }

  changedSupplier(obj) {
	const supplier_obj = obj.data[0];

	console.log(supplier_obj);
	if (supplier_obj.isNew) {
				// trigger some sort of confirm popup
				if (window.confirm('Are you sure you want to create \'' + supplier_obj.text + '\' ?')) {

						const params = {'supplier_name': supplier_obj.text};
						this.createMaterialSupplier(params);

					  }

			return;
		}

	const payload = {'supplier_id': supplier_obj.id, 'supplier': true};
	 this.materialService.updateMaterial(payload, this.container.lot.material.id).subscribe((r) => {  this.container.lot.material = r;   });


  }

  createMaterialSupplier(obj) {
	console.log(obj);
	this.materialSupplierService.create(obj).subscribe((r) => {

			console.log(r);
			const payload = {'supplier_id': r.id, 'supplier': true};
			this.materialService.updateMaterial(payload, this.container.lot.material.id).subscribe((r2) => {  this.container.lot.material = r2;   });


		});

	}


	deleteContainer() {


		if(confirm('Are you sure you want to delete this container?')) {
			this.materialLotCotainerService.delete(this.container.id).subscribe(r => {

							this.router.navigate(['/material/container/database'], {queryParams: { refreshTable: true}});

			});

		}

	}

	fetchPotentialMSDS() {

		const params = this.MsdsSearch;
		
		if(this.searchingPossibleSDS === false && this.container.lot.material)
		{
		this.searchingPossibleSDS = true;
		params.p1 = 'MSMSDS.COMMON|' + this.container.lot.material.name.toLowerCase();
		params.p2 = 'MSMSDS.MANUFACT|' + this.container.lot.material.supplier.supplier_name.toLowerCase();
		params.p3 = 'MSCHEM.CAS|' + this.container.lot.material.cas;

		
		this.http.post<any>('https://chemicalsafety.com/sds1/retriever.php?filterSpinner', params).subscribe(r=>{

			console.log(r);
			this.sdsSearch = r.rows;

			console.log(this.sdsSearch);

			if(this.sdsSearch[0]) { this.searchingPossibleSDS = false; }

		
			if(r.rows.length === 0)
			{	
				const splitstring = params.p1.split(' ');
				params.p2 = null;
				params.p1 = splitstring[0];
				this.http.post<any>('https://chemicalsafety.com/sds1/retriever.php?filterSpinner', params).subscribe(r2=>{

					console.log(r2);

						this.sdsSearch = r2.rows;
				
						if(this.sdsSearch[0]) { 
							console.log(this.sdsSearch);
					
						
						}
						this.searchingPossibleSDS = false;
					});

			}

		});
		}
	}

	navigateToSDS(item)
	{
		const win = window.open("https://chemicalsafety.com/sds1/sdsviewer.php?id="+item[0], '_blank');
 		 win.focus();
	}


}

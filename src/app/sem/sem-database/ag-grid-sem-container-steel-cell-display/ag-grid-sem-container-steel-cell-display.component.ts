import { Component, OnInit, OnDestroy } from '@angular/core';


import {ICellRendererAngularComp} from 'ag-grid-angular';

import { Router } from '@angular/router';


import { PopUpSteelCardServiceService } from '../../../shared/pop-up-steel-card/pop-up-steel-card-service.service';

@Component({
  selector: 'app-ag-grid-sem-container-steel-cell-display',
  templateUrl: './ag-grid-sem-container-steel-cell-display.component.html',
  styleUrls: ['./ag-grid-sem-container-steel-cell-display.component.css']
})
export class AgGridSemContainerSteelCellDisplayComponent implements ICellRendererAngularComp, OnDestroy  {

  params: any;
  showEditIcon: false;

  constructor(private router:Router, public steelPopUp: PopUpSteelCardServiceService){}


  refresh(){
    return false;
  }

  agInit(params: any): void {
  //  console.log(params);

    this.params = params;
     
  }
  afterGuiAttached?(params?: import('ag-grid-community').IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  goToSteel(params)
  {
    this.steelPopUp.hide();
    this.router.navigate(['/steel/' + params.value]);

  }

  ngOnDestroy()
  {
    console.log('fired');
  }
}

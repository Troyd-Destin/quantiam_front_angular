import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/dist/interfaces';


import { PopUpSteelCardServiceService } from '../../../shared/pop-up-steel-card/pop-up-steel-card-service.service';

@Component({
  selector: 'app-ag-grid-sem-container-steel-edit',
  templateUrl: './ag-grid-sem-container-steel-edit.component.html',
  styleUrls: ['./ag-grid-sem-container-steel-edit.component.css']
})
export class AgGridSemContainerSteelEditComponent implements ICellEditorAngularComp {
 
  params:any; 

  public selectedValue: any;
  public previousValue: any;

  private input: any;
 
  constructor(private popUpSteel: PopUpSteelCardServiceService) { }

  ngOnInit() {
  }


  getValue() {
    // throw new Error("Method not implemented.");
  }
  
  isPopup?(): boolean {
    return true;
  }
  focusIn?(): void {
    //throw new Error("Method not implemented.");
  }
  focusOut?(): void {
    //throw new Error("Method not implemented.");
  }
  agInit(params: import("ag-grid-community").ICellEditorParams): void {
    this.params = params;
    this.previousValue = params.value;
    this.popUpSteel.hide(); // Hide any steel pop ups that might be around
  }
  afterGuiAttached?(params?: import("ag-grid-community").IAfterGuiAttachedParams): void {
    //throw new Error("Method not implemented.");
  }

  

}

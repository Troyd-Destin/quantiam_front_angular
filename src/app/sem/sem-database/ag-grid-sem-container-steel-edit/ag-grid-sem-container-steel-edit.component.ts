import { Component, OnInit, AfterViewInit,ViewChild, HostListener,ViewContainerRef, ElementRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';


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
  container = false;
  steel = false;
  sample = false;

  selectedContainer = {};
  selectedSteel = {};
  selectedSample = {};

  private input: any;

  @ViewChild('containerEditor', { read: ViewContainerRef, static: true }) public containerEditor;  // reference the container 
  @ViewChild('editor', { read: ViewContainerRef, static: true }) public editor;  // reference the container 


  @HostListener("keydown", ["$event"])
  public onKeydown(event: any): void
  {
     
      event.stopPropagation();
      const key = event.which || event.keyCode;
      console.log(event.keyCode);
      

      if(key === 9 && (this.selectedContainer.hasOwnProperty('id') || this.selectedSteel.hasOwnProperty('id') || this.selectedSample.hasOwnProperty('id') ))
      {
         setTimeout((X)=>{

          this.editor.element.nativeElement.focus();
          this.params.api.tabToNextCell();
         },100)
      //  this.params.api.startEditingCell({rowIndex: this.params.rowIndex, colKey: 'samplename', });
      }
  }
 
  constructor(private popUpSteel: PopUpSteelCardServiceService) { }


  agInit(params: import("ag-grid-community").ICellEditorParams): void {
    this.params = params;
    console.log(params);
    this.previousValue = params.value; // store previous value in case we need it

    this.popUpSteel.hide(); // Hide any steel pop ups that might be around

    


    //check to see if container or steel
    if(params.node.data.container_id){ this.container = true; }
    if(params.node.data.manu_inventory_id){ this.steel = true; }


    window.setTimeout(() => { // foc
      console.log(this.containerEditor);
      this.input = this.containerEditor.element.nativeElement.firstChild.firstChild.firstChild.children[1].firstChild;
    //  this.input.value = this.params.charPress;
      this.input.focus();

   },100);


  }


  

  getValue() {
    // throw new Error("Method not implemented.");
    

    if(this.container){
      console.log(this.selectedContainer);
      return this.selectedContainer;
    }

    if(this.steel)
    {
      return this.selectedSteel;
    }

    if(typeof this.selectedValue === 'undefined'){ return this.previousValue; }
    
    return this.selectedValue;
  }
  
  isPopup?(): boolean {
    return true;
  }
  focusIn?(): void {
    //throw new Error("Method not implemented.");
   // console.log('test');
  }
  focusOut?(): void {
    //throw new Error("Method not implemented.");
  }
  afterGuiAttached?(params?: import("ag-grid-community").IAfterGuiAttachedParams): void {
    //throw new Error("Method not implemented.");
  }

  
  selectContainer(obj){

    this.selectedContainer = obj;
    //this.getValue();
  }


  clearSelectedContainer()
  {
    this.selectedContainer = null;
    console.log('test');

  }

  selectSample(obj)
  {
    this.selectedSample = obj;
  }

  clearSelectedSample()
  {
    this.selectedSample = null;

  }

  selectSteel(obj)
  {
    this.selectedSteel = obj;

  }

  clearSelectedSteel()
  {
    this.selectedSteel = null;

  }


}

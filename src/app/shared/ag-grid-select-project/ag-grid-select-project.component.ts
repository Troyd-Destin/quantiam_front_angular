import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';

import {ICellEditorAngularComp} from 'ag-grid-angular';


@Component({
  selector: 'app-ag-grid-select-project',
  templateUrl: './ag-grid-select-project.component.html',
  styleUrls: ['./ag-grid-select-project.component.css']
})
export class AgGridSelectProjectEditorComponent implements ICellEditorAngularComp, AfterViewInit {

  private params: any;

  public selectedValue: any;
  public previousValue: any;

  private input: any;

  @ViewChild('projectEditor', {read: ViewContainerRef}) public container;  // reference the container 

  constructor() { }

 

  ngAfterViewInit() {
    window.setTimeout(() => {    
   //   console.log(this.container.element.nativeElement.firstChild.firstChild.firstChild.children[1].firstChild);
       this.input = this.container.element.nativeElement.firstChild.firstChild.firstChild.children[1].firstChild;
       
       //console.log(this.input);
       this.input.value = this.params.charPress;
       this.input.focus();

    },100);
  }

  isPopup(): boolean {
    return true;
  }

  agInit(params: any): void {
    console.log(params);
    this.params = params;
    this.previousValue = params.value;
    

    //this.container.element.nativeElement.firstChild.firstChild.firstChild.children[1].firstChild.val('7');
  }

  getValue(): any {

    if(typeof this.selectedValue === 'undefined'){ return this.previousValue; }
    
    return this.selectedValue.id;
  }

  selectValue(event)
  {
    console.log(event);
    this.selectedValue = event;
    this.params.api.stopEditing();
    this.params.api.tabToNextCell();
  }


  
  onKeyDown(event): void {
    const key = event.which || event.keyCode;
    console.log(event.keyCode);
    if (key === 37 ||  // left
        key === 39 || key === 27 ) {  // right
       // this.toggleMood();
       this.params.api.stopEditing();
       
    }

    if(key === 39){ this.params.api.tabToNextCell(); }
    if(key === 37){ this.params.api.tabToPreviousCell(); }
  }
}
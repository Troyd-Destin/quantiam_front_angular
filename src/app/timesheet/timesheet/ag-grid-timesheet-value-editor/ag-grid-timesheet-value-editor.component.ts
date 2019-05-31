
import {AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';

import {ICellEditorAngularComp} from 'ag-grid-angular';

import * as moment from 'moment';

@Component({
  selector: 'app-ag-grid-timesheet-value-editor',
  templateUrl: './ag-grid-timesheet-value-editor.component.html',
  styleUrls: ['./ag-grid-timesheet-value-editor.component.css']
})
export class AgGridTimesheetValueEditorComponent implements ICellEditorAngularComp, AfterViewInit {


  private params: any;

  longDate;
  dayOfWeek;

  value : any;
  node: any;

  public selectedValue: any;
  public previousValue: any;

  private input: any;
  private focused: boolean = false;

  @ViewChild('valueField', { read: ViewContainerRef, static: true }) public minuteInput: any;  // reference the container 

  constructor() { 

      console.log(this.value);

  }

  ngAfterViewInit() {



        setTimeout(() => {
            this.minuteInput.element.nativeElement.select();
            this.minuteInput.element.nativeElement.focus();


            if(this.params.keyPress === 8)
            {
              this.value = null;
              this.params.api.stopEditing();
              this.params.api.tabToNextCell();
              this.params.api.tabToPreviousCell(); 
            }
        }, 0);
     

  }

  
  isPopup(): boolean {
    return true;
  }

  agInit(params: any): void {
    
    this.params = params;
    this.value = params.value;

    if(this.params.charPress && !isNaN(this.params.charPress)){ this.value = this.params.charPress; }
    console.log(this.params);
   
    this.longDate = moment(params.column.colDef.field).format("ddd - MMM Do, YYYY");
    //this.dayOfWeek = moment(params.column.colDef.field).format("ddd");
    //this.minutes = Math.floor(this.previousValue / 60);


   

  }

  getValue(): any {
  //  console.log(this.value);
    if(this.value){ return '' + this.toNearest(this.value,0.25) + ''; }
    return '';
  }

  selectValue(event)
  {
    
    this.selectedValue = event;
    this.params.api.stopEditing();
    this.params.api.tabToNextCell();
    this.params.api.tabToPreviousCell(); 
  }


  
  onKeyDown(event): void {
    const key = event.which || event.keyCode;
    //console.log(event.keyCode);
    if (key === 37 ||  // left
        key === 39 || key === 27 ) {  // right
          this.params.api.stopEditing(true);       
          this.params.api.tabToNextCell();
          this.params.api.tabToPreviousCell(); 
       
       
    }

    if(key === 39){ this.params.api.tabToNextCell(); }
    if(key === 37){ this.params.api.tabToPreviousCell(); }
  }

  toNearest(num, frac) {
    return Math.ceil(num / frac) * frac;
  }

}

import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpSteelCardServiceService {

  constructor() { }
  
  @Output() change: EventEmitter<any> = new EventEmitter();


  show(steelObj)
  {
      this.change.emit(steelObj);
  }

  hide()
  {
 
    this.change.emit({});
  }

}

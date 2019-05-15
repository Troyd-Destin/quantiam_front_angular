
import { environment } from '../../../environments/environment';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, delay, shareReplay, publishReplay, refCount } from 'rxjs/operators';

@Component({
  selector: 'app-select-semrun-type',
  templateUrl: './select-semrun-type.component.html',
  styleUrls: ['./select-semrun-type.component.css']
})
export class SelectSemrunTypeComponent implements OnInit {
  // Inputs
  @Input() selectedValue: any = null; // default value, object or ID
  @Input() multiple: any = false; // multi version
  @Input() selectableGroup: any = false; // multi version
  @Input() placeholder = 'Select Experiment'; // multi version

  // Outputs
  @Output() change = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();

  private endpoint = '/instrument/sem/run/type/list';
  // private modelName = 'User';

  items = [];
  itemsBuffer;
  bufferSize = 50;
  virtualScroll = true;
  loading = false;
  dropdownWidth = 300;

  showActive = true;
  showInactive = false;

  constructor(public http: HttpClient, ) { }

  ngOnInit() {

    this.http.get<any>(environment.apiUrl + `${this.endpoint}`)
    .subscribe(items => {
            this.itemsBuffer = items;
            console.log(this.itemsBuffer);
        });

  }

  onChange(event) { this.change.emit(event); }
  onClear(event) { this.clear.emit(event); }
  onAdd(event) {}
  onRemove(event) {}

  customSearchFn(term: string, item) {  // good for lists we store in their entirety
   console.log(term,item);
    term = term.toLocaleLowerCase();
    const id = item.type_id + ''; 

    return item.type.toLocaleLowerCase().indexOf(term) > -1
    || id === term ;

}

private onOpen(event) {

  setTimeout((x) => {

    const dropdown = document.querySelector('.total-padding');
    dropdown.setAttribute('style', 'width:' + this.dropdownWidth + 'px !important;height: 1800px;'); // this changes the dropdown to be as wide as it's contents
    // dropdown.setAttribute('style',''); //workaround

  }, 100);

  }

}

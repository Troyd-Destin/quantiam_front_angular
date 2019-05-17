import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SelectMaterialSupplierService } from './select-material-supplier.service';

@Component({
  selector: 'app-select-material-supplier',
  templateUrl: './select-material-supplier.component.html',
  styleUrls: ['./select-material-supplier.component.css']
})
export class SelectMaterialSupplierComponent implements OnInit, OnDestroy {

  list$: any;
  items: any = [];
  
  virtualScroll = true;
  
  dropdownWidth = 250; // in pixels


  // Inputs
  @Input() selectedValue: any = null; // default value, object or ID
  @Input() multiple: any = false; // multi version
  @Input() selectableGroup: any = false; // multi version

  // Outputs
  @Output() change = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();

  constructor(private service: SelectMaterialSupplierService) { }

  ngOnInit() {

    // retrieve from project service
    // this.items = ['true', 'Two', 3,'test'];

   // this.service.list();
    this.list$ = this.service.list$.subscribe((r) => {

        this.items = r;

      });

  }

  

  onChange(event) { this.change.emit(event); }
  onClear(event) { this.change.emit(event); }

  customSearchFn(term: string, item) {  // good for lists we store in their entirety
  //  console.log(term,item);
    term = term.toLocaleLowerCase();

    item.id = String(item.id);
    return item.id.toLocaleLowerCase().indexOf(term) > -1
    || item.Description.toLocaleLowerCase().indexOf(term) > -1;

  }


 onOpen() {

    setTimeout((x) => {

      const dropdown = document.querySelector('.total-padding');
      dropdown.setAttribute('style', 'width:' + this.dropdownWidth + 'px !important;height: 1800px;'); // this changes the dropdown to be as wide as it's contents
      // dropdown.setAttribute('style',''); //workaround

    }, 100);

  }


  ngOnDestroy() {
    this.list$ .unsubscribe();
  }
}

import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SelectUserService } from './select-user.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit, OnDestroy {

  list$: any;
  items: any = [];
  allItems: any = [];
  showActive = true;
  showInactive = false;
  virtualScroll = true;

  // Inputs
  @Input() selectedValue: any = null; // default value, object or ID
  @Input() multiple: any = false; // multi version
  @Input() selectableGroup: any = false; // multi version
  @Input() placeholder = 'Select Somebody'; // multi version

  // Outputs
  @Output() change = new EventEmitter<any>();


  constructor(private selectUserService: SelectUserService) { }

  ngOnInit() {

    this.selectUserService.list(); // Make sure the service is initialized.
    this.list$ = this.selectUserService.list$.subscribe((r) => {


         this.allItems = r;
       //   if(r[0]) this.showItems();
          if (r[0]) {  this.showItems(); }


      });
  }

  showItems() {
    console.log(this.showActive, this.showInactive);

    if (this.showActive && !this.showInactive) {

    this.items = this.allItems.filter((obj) => {

        return obj.active;

      });
    }

    if (!this.showActive && this.showInactive) {

    this.items = this.allItems.filter((obj) => {

        return !obj.active;

      });
    }


   if (!this.showActive && !this.showInactive) { this.items = []; }
   if (this.showActive && this.showInactive) {this.items = this.allItems; }
  }

  onChange(event) {
     this.change.emit(event);
  }

  ngOnDestroy() {
   if (this.list$) { this.list$.unsubscribe(); }
  }

}

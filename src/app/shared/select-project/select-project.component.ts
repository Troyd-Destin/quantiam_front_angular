import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.css']
})
export class SelectProjectComponent implements OnInit, OnDestroy {

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

  // Outputs
  @Output() change = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();

  constructor(private projectService: ProjectService) { }

  ngOnInit() {

    // retrieve from project service
    // this.items = ['true', 'Two', 3,'test'];

    this.projectService.list();
    this.list$ = this.projectService.list$.subscribe((r) => {

      console.log(r);
          this.allItems = r;
          if (r[0]) { this.showItems(); }

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


  onChange(event) { this.change.emit(event); }
  onClear(event) { this.change.emit(event); }

  customSearchFn(term: string, item) {  // good for lists we store in their entirety
    console.log(term,item);
    term = term.toLocaleLowerCase();

    item.id = String(item.id);
    return item.id.toLocaleLowerCase().indexOf(term) > -1
    || item.Description.toLocaleLowerCase().indexOf(term) > -1;

}


  ngOnDestroy() {
    this.list$ .unsubscribe();
  }
}


import { environment } from '../../../environments/environment';
import { Component, OnInit, Input, EventEmitter, Output, ElementRef  } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap, delay, debounceTime, distinctUntilChanged, switchMap, shareReplay, publishReplay, refCount } from 'rxjs/operators';
import { Subject, Observable, of, concat, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select-material',
  templateUrl: './select-material.component.html',
  styleUrls: ['./select-material.component.css']
})


export class SelectMaterialComponent implements OnInit {


  selectedPersons = [{ name: 'Karyn Wright' }, { name: 'Other' }];

  public _people3input = new BehaviorSubject({});
  public people3$: Observable<any> = this._people3input.asObservable();

  input$ = new Subject<string>();


    // Inputs
  @Input() selectedValue: any = null; // default value, object or ID
  @Input() multiple: any = false; // multi version
  @Input() selectableGroup: any = false; // multi version
  @Input() placeholder = 'Select Material'; // multi version

  // Outputs
  @Output() change = new EventEmitter<any>();

  private endpoint = '/material';
  // private modelName = 'User';

  items = [];
  itemsBuffer = [];
  allRetrievedItemsList = [];
  dropdownWidth = 650; // in pixels
  bufferSize = 150;
  virtualScroll = true;
  numberOfItemsFromEndBeforeFetchingMore = 50;
  totalResults;
  loading = false;
  page = 1;
  searchingTerm = false;

  showActive = true;
  showInactive = false;

  supressScrollEnd = false;

  constructor(public http: HttpClient, private _elementRef: ElementRef) {}



  ngOnInit() {

    this.loadItems();
    this.onSearch();

    // this._people3input.next(this.selectedPersons);
  }

  onChange(event) {  this.change.emit(event); }
  onAdd(event) { }
  onRemove(event) { }
  onClear(event) {
    this.itemsBuffer = this.allRetrievedItemsList;
    this.searchingTerm = false;
  }

  onSearch() {

    this.input$.pipe(
         debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => {

          this.supressScrollEnd = true;
          this.searchingTerm = true;

          


          if(!term) { 
          
            this.itemsBuffer = this.allRetrievedItemsList;
            this.supressScrollEnd = false;
            this.searchingTerm = false;

            return [];
          }
         
          const params  = new HttpParams().set('like', term).set('limit', '' + this.bufferSize + '').set('active', '1').set('filterSpinner', 'true');

          return this.http.get<any>(environment.apiUrl + `${this.endpoint}`, { 'params': params } );

        })
    )
    .subscribe((data) => {

     
      this.allRetrievedItemsList = this.itemsBuffer;
      this.itemsBuffer = data;

     if (!data[0]) {
        if (this.itemsBuffer.length < this.bufferSize) { this.itemsBuffer = this.allRetrievedItemsList; }
      }

      this.searchingTerm = false;

    });

  }


  loadItems() {


    // use a service
    console.log('loadItems');
    const params  = new HttpParams().set('page', this.page.toString());

    this.http.get<any>(environment.apiUrl + `${this.endpoint}`, { 'params': params } )
    .subscribe(items => {
            console.log(items);
           // this.items = items.data;
            this.totalResults = items.total;
            this.itemsBuffer = items.data;
        });


  }

  onScrollToEnd() {
    if(!this.supressScrollEnd) {
    this.fetchMore();
    }
  }

  onScroll() {
   
  }

  customSearchFn(term: string, item) {  // good for lists we store in their entirety
    // console.log(term,item);
    term = term.toLocaleLowerCase();

    return item.lot.material.name.toLocaleLowerCase().indexOf(term) > -1
    || item.lot.lot_name.toLocaleLowerCase().indexOf(term) > -1
    || item.identifier.toLocaleLowerCase().indexOf(term) > -1;

}


  private fetchMore() {

      // use a service as well
      console.log('fetchMore');
    this.loading = true;
    this.page = this.page + 1;
    // query the next page of results, and add them here
    const params = new HttpParams().set('page', this.page.toString()).set('filterSpinner', 'true');

    this.http.get<any>(environment.apiUrl + `${this.endpoint}`, { params: params } )
    .subscribe(items => {
            this.page = items.current_page;
            this.loading = false;

            this.itemsBuffer = this.itemsBuffer.concat(items.data);
        });
  }


  private onOpen() {

  setTimeout((x) => {

    const dropdown = document.querySelector('.total-padding');
    dropdown.setAttribute('style', 'width:' + this.dropdownWidth + 'px !important;height: 1800px;'); // this changes the dropdown to be as wide as it's contents
    // dropdown.setAttribute('style',''); //workaround

  }, 100);

  }





}

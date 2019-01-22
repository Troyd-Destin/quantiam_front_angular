import { environment } from '../../../environments/environment';
import { Component, OnInit, Input, EventEmitter, Output, ElementRef  } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap, delay, debounceTime, distinctUntilChanged, switchMap, shareReplay, publishReplay, refCount } from 'rxjs/operators';
import { Subject, Observable, of, concat, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select-material-container',
  templateUrl: './select-material-container.component.html',
  styleUrls: ['./select-material-container.component.css']
})
export class SelectMaterialContainerComponent implements OnInit {


  selectedPersons = [{ name: 'Karyn Wright' }, { name: 'Other' }];

  public _people3input = new BehaviorSubject({});
  public people3$: Observable<any> = this._people3input.asObservable();

  input$ = new Subject<string>();


    // Inputs
  @Input() selectedValue: any = null; // default value, object or ID
  @Input() multiple: any = false; // multi version
  @Input() selectableGroup: any = false; // multi version
  @Input() placeholder = 'Select Container'; // multi version

  // Outputs
  @Output() change = new EventEmitter<any>();

  private endpoint = '/material/lot/container';
  // private modelName = 'User';

  items = [];
  itemsBuffer = [];
  allRetrievedItemsList = [];
  dropdownWidth = 900; // in pixels
  bufferSize = 75;
  virtualScroll = true;
  numberOfItemsFromEndBeforeFetchingMore = 40;
  totalResults;
  loading = false;
  page = 1;

  showActive = true;
  showInactive = false;

  constructor(public http: HttpClient, private _elementRef: ElementRef) {}



  ngOnInit() {

    this.loadItems();
    this.onSearch();

    // this._people3input.next(this.selectedPersons);
  }

  onChange(event) { this.change.emit(event); }
  onAdd() { }
  onRemove() { }
  onClear() {
    console.log('test');
    this.itemsBuffer = this.allRetrievedItemsList;
  }

  onSearch() {

    this.input$.pipe(
         debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => {

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

    });

  }


  loadItems() {


    // use a service

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
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.totalResults === this.itemsBuffer.length) {
        return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length) {
        this.fetchMore();
    }
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

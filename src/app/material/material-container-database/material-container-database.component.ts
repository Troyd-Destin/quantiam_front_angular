import {  AfterViewInit,  Component,  OnInit,  ViewChild} from '@angular/core';
import {  HttpClient,  HttpResponse} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import {  MaterialLotContainerDatatableService} from '../services/material-lot-container-datatable.service';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import {  ContainerAggridService } from '../services/container-aggrid.service';
import { LocationService } from '../../services/location/location.service';
import {  environment} from '../../../environments/environment';


@Component({
  selector: 'app-material-container-database',
  templateUrl: './material-container-database.component.html',
  styleUrls: ['./material-container-database.component.css']
})
export class MaterialContainerDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  private rowData: any = [{}, {}];

  private components: any;
  private columnDefs;
  private statusBar: any;
  private defaultColDef;
  private rowModelType;
  private cacheBlockSize;
  private maxBlocksInCache;
  private getRowNodeId;
  private icons;
  private cellOldValue;
  private searchBarValue: string;
  private frameworkComponents;
  private context;

  private locationList: any = [];
  private locationListObj: any[];

  private navigateMode = true;
  private editMode = true;
  private editableContainerCellFields = ['location', 'purchase_order', 'qcid', 'container_name', 'container_number'];


  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, public containerAggridService: ContainerAggridService,	private locationService: LocationService, private materialLotContainerService: MaterialLotContainerService ) {

  this.locationList = [];

  this.columnDefs = [{
        field: 'container_id',
        width: 100,
        hide: true,
        headerName: 'ID',

      },
      {
        width: 75,
        field: 'qcid',
        headerName: 'QCID',
        suppressMenu: true,
      },
      {
        width: 250,
        field: 'material',
        cellStyle: function (params) {

          return {
            'font-size': '12px',
            'font-weight': 600,
            cursor: 'pointer',
          };
        },
      },
      {
        width: 150,
        field: 'grade'
      },
      {
        width: 100,
        field: 'supplier'
      },
      {
        field: 'lot_name',
        headerName: 'Lot',
        width: 90,
      },
      {
        width: 80,
        field: 'size'
      },
      {
        width: 90,
        field: 'catalog'
      },
      {
        width: 90,
        field: 'cas',
      },
      {
        width: 90,
        field: 'purchase_order',
        headerName: 'PO #',
      },
      {
        width: 150,
        field: 'container_name',
        headerName: 'Container Name',
      },
      {
        width: 80,
        field: 'container_number',
        headerName: '#',
      },
      {
        width: 120,
        field: 'location',
        cellEditorParams: {
          values: this.locationList,
        },
        cellEditor: 'agRichSelectCellEditor',
      },

      {
        width: 120,
        field: 'container_received',
        headerName: 'Received',
        sort: 'desc',
     //   cellEditor: "datePicker",
      },
      {
        field: 'updated_at',
        hide: true,
        headerName: 'Updated'
      },
      {
        field: 'active',
        width: 80,
        headerName: '?',
        cellRenderer: function(cell) {

         // console.log(cell);
          if (cell.value) {
            return '<p style="color:green">In Stock</p>';
          }

          return '<p style="color:orange"> Used up </p>';
        },

      },
      {
        field: 'sds',
        width: 80,
        headerName: 'SDS',
        cellRenderer: function(cell) {

         // console.log(cell);
          if (cell.value) {
            return '<p style="color:green">View</p>';
          }

          if (cell.data.active) { return '<p style="color:red">Missing</p>'; }

          return '';
        },
        onCellClicked: (cell ) => {

          if (cell.value) { this.fetchSDS(cell.data.material_id); }
          //  console.log('worked');

        }

      },
      {
        width: 100,
        field: 'sds_updated_at',
        headerName: 'Updated',
        hide: true,
      },
    ];

 //   this.components = { datePicker: getDatePicker() };

    this.defaultColDef = {

      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: function (params) {
        return {
          cursor: 'pointer',
        };
      },

    };

    this.statusBar = {
      statusPanels: [
        {
          statusPanel: 'agTotalRowCountComponent',
          align: 'left'
        },
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
      //  { statusPanel: 'agAggregationComponent' }
      ]
    };

    // this.rowModelType = "serverSide";
    // this.cacheBlockSize = 10;
    // this.maxBlocksInCache = 2;
    this.getRowNodeId = function (item) {
      return item.id;
    };

    this.context = { componentParent: this };
    this.frameworkComponents = {
     // 'aggridActiveParentComponent': AggridActiveParentComponent,
    };



  }

  ngOnInit() {


    this.containerAggridService.getDatabase({});
    this.locationService.getList();
    this.locationService.list$.subscribe((r) => {

       // console.log(r);
        if (r[0]) {
          this.locationListObj = r;
          r.forEach((obj) => {

            this.locationList.push(obj.name);

          });
        }

    });

    this.route.queryParams.subscribe((queryParams: any) => {

      console.log(queryParams);

      if (queryParams.refreshTable === 'true') {

        this.fetchTableData();
        console.log('fetched?');

      }


  });


  }

  fetchTableData() {
      this.containerAggridService.getDatabase({}, true);

  }


  refreshTable() {

    $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {

      return true;

    });
  }



  daysSunshineRenderer() {

    return '<b> Test</b>';
}

  /** Ag Grid Comparison */

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;


    this.containerAggridService.Database$.subscribe((r) => {
      // console.log(r);
      if (r[0]) { this.rowData = r; }
      setTimeout(() => {  this.gridApi.sizeColumnsToFit(); }, 300);
    });
  }

  sizeColumnsToFit() {
    setTimeout(() => {  this.gridApi.sizeColumnsToFit(); }, 300);
  }

  onCellEditingStarted(event) {
    console.log(event);
    this.cellOldValue = event.value;
  }


  onCellEditingStopped(event) {

    // event.data.id

    // alert('Doesn\'t save to server yet');
    if (this.cellOldValue !== event.value) {
      console.log(event);
      let params: any = {};
      params[event.column.colId] = event.value;



      if (event.column.colId === 'location') {

          const locationObj = this.locationListObj.find((location) => {

              return event.value === location.name;

          });

          console.log(locationObj);
          params = {'location_id': locationObj.id};


        }
        console.log('Updated', params, event.data);
          this.materialLotContainerService.update(params, event.data.container_id).subscribe((r) => {



      });


    }
  }


  toggleCellsEditable() {

      this.navigateMode = !this.navigateMode;
      let editable = false;
      let color = 'rgba(242, 250, 255,0);';

      if (!this.navigateMode) {
         editable = true;
        color = 'rgb(242, 250, 255);';
        }

        this.columnDefs.forEach((obj) => {

          if (this.editableContainerCellFields.includes(obj.field)) {
                 obj.editable = editable;
                 obj.cellStyle = function (params) {
                  return {
                    cursor: 'pointer',
                    'background-color':  color,
                  };
                };
            }
        });


      //  console.log(this.locationList), this.columnDefs;

        this.gridApi.setColumnDefs(this.columnDefs);
        this.gridApi.sizeColumnsToFit();
    }

  onRowDoubleClicked(event) {
    if (this.navigateMode) { this.router.navigate(['/material/container/' + event.data.container_id]); }
    return;
  }

  onFilterChanged() {
    this.gridApi.setQuickFilter(this.searchBarValue);
  }


	fetchSDS(id) {
		this.http.get(environment.apiUrl + '/material/' + id + '/sds?filterSpinner',  {responseType: 'blob'}).subscribe((response) => {


        const url = window.URL.createObjectURL(response);
     	 window.open(url);

		});

	}

  // ngOnDestroy() {  }

}




import {  AfterViewInit,  Component,  OnInit,  ViewChild} from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MaterialCreationDialogComponent } from '../material-creation-dialog/material-creation-dialog.component';

import {  MaterialLotContainerDatatableService} from '../services/material-lot-container-datatable.service';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import {  ContainerAggridService } from '../services/container-aggrid.service';
import { LocationService } from '../../services/location/location.service';
import {  environment} from '../../../environments/environment';

import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-material-container-database',
  templateUrl: './material-container-database.component.html',
  styleUrls: ['./material-container-database.component.css']
})
export class MaterialContainerDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
   rowData: any = [{}, {}];


   gridOptions;
   rowModelType;
   rowSelection;
   maxBlocksInCache;
   cacheBlockSize;
   oldCellValue;


   components: any;
   columnDefs;
   statusBar: any;
   defaultColDef;
   getRowNodeId;
   icons;
   cellOldValue;
   searchBarValue: string;
   frameworkComponents;
   totalRows;
   context;

   filteredTextFilterName;

  private locationList: any = [];
  private locationListObj: any[];

  private navigateMode = true;
  private editMode = true;
  private editableContainerCellFields = ['location', 'purchase_order', 'qcid', 'container_name', 'container_number'];


  constructor( public userService: UserService,
    private dialog: MatDialog, private http: HttpClient, public router: Router, private route: ActivatedRoute,
    public containerAggridService: ContainerAggridService,	private locationService: LocationService,
    private materialLotContainerService: MaterialLotContainerService ) {

  this.locationList = [];

  this.columnDefs = [
      {
        field: 'container_id',
        width: 100,
        hide: true,
        headerName: 'Container ID',

      },
      {
        field: 'lot.material.id',
        width: 100,
        hide: true,
        headerName: 'Material ID',

      },
      {
        width: 70,
        field: 'qcid',
        headerName: 'QCID',
        suppressMenu: true,
      },
      {
        width: 200,
        headerName: 'Name',
        field: 'lot.material.name',
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
        field: 'lot.material.grade',        
        headerName: 'Grade',
      },
      {
        width: 100,
        field: 'lot.material.particle_size',
        headerName: 'P. Size',
      },
      {
        width: 100,
        field: 'lot.material.supplier.supplier_name',
        headerName: 'Suplier',
      },
      {
        field: 'lot.lot_name',
        headerName: 'Lot',
        width: 90,
      },
      {
        width: 80,
        headerName: 'Amount',
        cellRenderer: function(cell) {

           if(!cell.hasOwnProperty('data')){ return ''; };
            return cell.data.denomaintion;
        }
      },
      {
        width: 90,
        field: 'lot.material.cas',
      },
      {
        width: 90,
        field: 'purchase_order',
        headerName: 'PO #',
      },
      {
        width: 100,
        field: 'container_name',
        headerName: 'C. Name',
        hide: true,
      },
      /* {
        width: 80,
        field: 'container_number',
        headerName: '#',
      }, */
      {
        width: 120,
        field: 'location.name',
        cellEditorParams: {
          values: this.locationList,
        },
        cellEditor: 'agRichSelectCellEditor',
      },

      {
        width: 120,
        field: 'container_received',
        headerName: 'Received',
        // sort: 'desc',
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
        field: 'empty',
        width: 80,
        headerName: 'Empty',
        cellRenderer: function(cell) {

          //console.log(cell);
          if (cell.value) {
            return '<p style="color:orange">Empty</p>';
          }

          return '';
        },

      },
      {
        field: 'sds',
        width: 80,
        headerName: 'SDS',
        cellRenderer: function(cell) {

         // console.log(cell);
           console.log(cell);
           if(!cell.hasOwnProperty('data')){ return '' };
          if (cell.value) {
            return '<p style="color:green"> SDS </p>';
          }
          if (cell.data.active && cell.data.supplier === 'Quantiam' && !cell.value) {
            return '<p style="color:orange">Internal</p>';
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
        headerName: 'SDS Updated',
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

    this.gridOptions = {
      rowSelection: 'single',
      cacheBlockSize: 20,
      enableRangeSelection: true,
      // maxBlocksInCache: 2,
     // enableServerSideFilter: false,
     // enableServerSideSorting: false,
      rowModelType: 'serverSide',
      pagination: true,
      maxConcurrentDatasourceRequests: 1,
       paginationPageSize: 10,
      // paginationAutoPageSize: true
    };


    this.getRowNodeId = function (item) {
      return item.id;
    };

    this.context = { componentParent: this };
    this.frameworkComponents = {
     // 'aggridActiveParentComponent': AggridActiveParentComponent,
    };



  }

  ngOnInit() {


 //   this.containerAggridService.getDatabase({});
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

        this.refreshDatabase();
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
    const datasource = this.fetchMaterialContainerDatabase();
    params.api.setServerSideDatasource(datasource); // datasource needs to be a serverSide model

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

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
   // dialogConfig.height = '0vh';
    dialogConfig.position = {'top': '50px'};
    const dialogRef = this.dialog.open(MaterialCreationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    //  console.log('The dialog was closed');
      this.refreshDatabase();
    });
}


fetchMaterialContainerDatabase () {

  return {
    getRows: (params2: any) => {
      console.log(params2);
      const page = (this.gridApi.paginationGetCurrentPage() + 1);

      const requestParams: HttpParams = new HttpParams()
      .append('limit', `${this.gridOptions.cacheBlockSize}`)      
      .append('like', `${this.filteredTextFilterName}`)
      .append('page', `${page}`);

        this.http.get(environment.apiUrl + '/material/lot/container', {params: requestParams}).subscribe((response: any) => {

             params2.successCallback(response.data, response.total);
             this.totalRows = response.total;
             this.gridApi.sizeColumnsToFit();
           ///  console.log(params2);
        });

    }
  };

}

refreshDatabase() {

  const datasource = this.fetchMaterialContainerDatabase();
  this.gridApi.setServerSideDatasource(datasource);
}


  // ngOnDestroy() {  }

}




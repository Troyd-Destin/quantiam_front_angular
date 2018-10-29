import {  AfterViewInit,  Component,  OnInit,  ViewChild} from '@angular/core';
import {  HttpClient,  HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTableDirective} from 'angular-datatables';

import {  MaterialLotContainerDatatableService} from '../services/material-lot-container-datatable.service';
import {  ContainerAggridService } from '../services/container-aggrid.service';
import {  environment} from '../../../environments/environment';


@Component({
  selector: 'app-material-container-database',
  templateUrl: './material-container-database.component.html',
  styleUrls: ['./material-container-database.component.css']
})
export class MaterialContainerDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  private rowData: any[];

  private columnDefs;
  private defaultColDef;
  private rowModelType;
  private cacheBlockSize;
  private maxBlocksInCache;
  private getRowNodeId;
  private icons;
  private cellOldValue;
  private searchBarValue: string;


  constructor(private http: HttpClient, public router: Router, public containerAggridService: ContainerAggridService) {

  this.columnDefs = [{
        field: "container_id",
        width: 100,
        headerName: 'ID',        
      },
      {
        width: 100,
        field:"qcid",
        headerName:"QCID",
      },
      {
        width: 300,
        field:"material"
      },
      {
        field:"location"
      },
      {
        field:"supplier"
      },
      {
        width: 100,
        field:"size"
      },
      {
        width: 150,
        field:"catalog"
      },
      {
        width: 150,
        field:"cas"
      },
      {
        width: 150,
        field:"purchase_order",
        headerName:"PO #",
      },
      {
        field:"container_received",
        headerName:"Received"
      },
      {
        field:"updated_at",
        hide:true, 
        headerName:"Updated"
      },
      {
        field:"active",
        width:100,
        headerName:"Active",

      },


    ];

    this.defaultColDef = { 

      cellStyle: function (params) {
        return {
          cursor: 'pointer';
        }
      },

    }

    this.rowModelType = "serverSide";
    this.cacheBlockSize = 10;
    this.maxBlocksInCache = 2;
    this.getRowNodeId = function (item) {
      return item.id;
    };


  }
  
  ngOnInit() {
    this.containerAggridService.getDatabase({});
  }




  refreshTable() {

    $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {

      return true;

    });
  }



  /** Ag Grid Comparison */

  onGridReady(params) {

    console.log('fire this');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.containerAggridService.Database$.subscribe((r) => {
      this.rowData = r;
      setTimeout(()=>{  this.gridApi.sizeColumnsToFit();},600);
    })
  }

  onRowDoubleClicked(event)
  {
    this.router.navigate(['/material/container/'+event.data.container_id]);       
  }

  onFilterChanged()
  {
    this.gridApi.setQuickFilter(this.searchBarValue);
  }

  ngOnDestroy() {
   


  }

}

import {  AfterViewInit,  Component,  OnInit,  ViewChild} from '@angular/core';
import {  HttpClient,  HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTableDirective} from 'angular-datatables';

import {  MaterialLotContainerDatatableService} from '../services/material-lot-container-datatable.service';
import { MaterialLotContainerService } from '../../services/material-lot-container/material-lot-container.service';
import {  ContainerAggridService } from '../services/container-aggrid.service';
import { LocationService } from '../../services/location/location.service';
import {  environment} from '../../../environments/environment';

import { AggridActiveParentComponent } from '../aggrid-active-parent/aggrid-active-parent.component'

@Component({
  selector: 'app-material-container-database',
  templateUrl: './material-container-database.component.html',
  styleUrls: ['./material-container-database.component.css']
})
export class MaterialContainerDatabaseComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  private rowData: any = [{},{}];

  private components:any;
  private columnDefs;
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

  private locationList:any =[];
  private locationListObj:any[];

  private navigateMode = true;
  private editMode = true;
  private editableContainerCellFields = ['location','purchase_order','qcid'];
  

  constructor(private http: HttpClient, public router: Router, public containerAggridService: ContainerAggridService,	private locationService: LocationService, private materialLotContainerService: MaterialLotContainerService ) {

  this.locationList = [];

  this.columnDefs = [{
        field: "container_id",
        width: 80,
        hide:true, 
        headerName: 'ID',    
         
      },
      {
        width: 80,
        field:"qcid",
        headerName:"QCID",
      },
      {
        width: 200,
        field:"material"
      },
      {
        width: 200,
        field:"grade"
      },
      {
        field:"supplier"
      },
      {
        field:"lot_name"
      },
    
      {
        width: 100,
        field:"size"
      },
      {
        width: 100,
        field:"catalog"
      },
      {
        width: 100,
        field:"cas",
      },
      {
        width: 120,
        field:"purchase_order",
        headerName:"PO #",
      },
      {
        width: 150,
        field:"container_name",
        headerName:"Container Name",
      },
      {
        width: 80,
        field:"container_number",
        headerName:"#",
      },
      {
        width: 150,
        field:"location",
        cellEditorParams: {
          values: this.locationList,
        },
        cellEditor: "agRichSelectCellEditor",
      },
      
      {
        field:"container_received",
        headerName:"Received",
     //   cellEditor: "datePicker",
      },
      {
        field:"updated_at",
        hide:true, 
        headerName:"Updated"
      },
      {
        field:"active",
        width:80,
        headerName:"Active",
      //  cellRenderer: function(){ return '<button mat-button> Test </button>';},
       

      },


    ];

    this.components = { datePicker: getDatePicker() };

    this.defaultColDef = { 

      cellStyle: function (params) {
        return {
          cursor: 'pointer',
        }
      },

    }

    //this.rowModelType = "serverSide";
    //this.cacheBlockSize = 10;
    //this.maxBlocksInCache = 2;
    this.getRowNodeId = function (item) {
      return item.id;
    };
    
    this.context = { componentParent: this };
    this.frameworkComponents = {
      "aggridActiveParentComponent": AggridActiveParentComponent,
    };

     
	
  }
  
  ngOnInit() {
    

    this.containerAggridService.getDatabase({});
    this.locationService.getList();
    this.locationService.list$.subscribe((r)=>{	
      
       // console.log(r);
        if(r[0])
        {
          this.locationListObj = r;
          r.forEach((obj) => {

            this.locationList.push(obj.name);

          })
        }
        
    });


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
      this.rowData = r;
      setTimeout(()=>{  this.gridApi.sizeColumnsToFit();},300);
    })
  }

  onCellEditingStarted(event) {
    console.log(event);
    this.cellOldValue = event.value;
  }

  
  onCellEditingStopped(event) {

    //event.data.id

    //alert('Doesn\'t save to server yet');
    if (this.cellOldValue != event.value) {
      console.log(event);
      let params: any = {};
      params[event.column.colId] = event.value;
      
    

      if(event.column.colId == 'location'){ 

          var locationObj = this.locationListObj.find((location)=>{

              return event.value == location.name;

          });

          console.log(locationObj);
          params = {'location_id': locationObj.id};          
        
        
        }
        console.log('Updated',params,event.data);
          this.materialLotContainerService.update(params,event.data.container_id).subscribe((r)=>{



      })


    }
  }

  
  toggleCellsEditable(){

      this.navigateMode = !this.navigateMode;
      var editable = false;
      var color = "rgba(242, 250, 255,0);"

      if(!this.navigateMode){
         editable = true;    
        color = "rgb(242, 250, 255);";
        }
      
        this.columnDefs.forEach((obj) => {
          
          if(this.editableContainerCellFields.includes(obj.field)){
                 obj.editable = editable;
                 obj.cellStyle = function (params) {
                  return {
                    cursor: 'pointer',
                    'background-color':  color,
                  }
                }
            }  
        });


        console.log(this.locationList);

        this.gridApi.setColumnDefs(this.columnDefs);
      
    }

  onRowDoubleClicked(event)
  {
    if(this.navigateMode) this.router.navigate(['/material/container/'+event.data.container_id]);       
    return;
  }

  onFilterChanged()
  {
    this.gridApi.setQuickFilter(this.searchBarValue);
  }

  ngOnDestroy() {  }

}



function getDatePicker() {
  function Datepicker() {}
  Datepicker.prototype.init = function(params) {
    this.eInput = document.createElement("input");
    this.eInput.value = params.value;
    $(this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
  };
  Datepicker.prototype.getGui = function() {
    return this.eInput;
  };
  Datepicker.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
  };
  Datepicker.prototype.getValue = function() {
    return this.eInput.value;
  };
  Datepicker.prototype.destroy = function() {};
  Datepicker.prototype.isPopup = function() {
    return false;
  };
  return Datepicker;
}
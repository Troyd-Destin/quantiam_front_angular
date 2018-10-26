import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SampleService } from '../../services/sample/sample.service';


@Component({
  selector: 'app-sample-database',
  templateUrl: './sample-database.component.html',
  styleUrls: ['./sample-database.component.css']
})
export class SampleDatabaseComponent implements OnInit {
  

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
  
  private sampleTypeList: any[] = ['5 % H2 Treatment (furnace)','Sintered Pellet','Carbon Impregnation','Post Cracking','Pellet Reduction','Carbon Physical Mixture'];
  
  
  constructor(
  private http: HttpClient,
  private router: Router,
  private sampleService: SampleService,
  
  ) {
    this.columnDefs = [
      { field: "id", width: 100,headerName: 'ID',cellStyle: function(params) { return {cursor:'pointer'}},  editable: false, },
      {headerName: 'Project', field: 'project',width:120 },
      {headerName: 'Name', field: 'name', width:300 },
      {headerName: 'Experiment', field: 'experiment', width:200},
      {headerName: 'Materials', field: 'container',  editable: false, width:120,  },
      { headerName: 'Creator', field:'created_by', editable: false, 
		cellStyle: function(params) { return {cursor:'pointer'}},
		valueGetter: function aPlusBValueGetter(params) { 
		  
		  if(params.data.creator)	  return params.data.creator.name;
		  return '';
		  
		  } },
      { field: "created_at",editable: false,  cellStyle: function(params) { return {cursor:'pointer'}}, },
      { field: "created_at", headerName: 'Delete', editable: false, width:130,suppressFilter: true, suppressMenu: true, suppressSorting:true, 
		cellStyle: function(params) { return {cursor:'pointer'}},
		cellRenderer: function (params){ 
		  return '<button mat-button class="mat-button mat-warn" style="color:red;">Delete</button>'; 
		  
		  
		  }, 
		onCellDoubleClicked: (params)=>{
		  
			this.deleteSample(params);
		  
		  } },
    ];
    
	//If Edit right
	
	this.defaultColDef = {
	  editable: true,
    };
	
	
    this.rowModelType = "serverSide";
    this.cacheBlockSize = 10;
    this.maxBlocksInCache = 2;
    this.getRowNodeId = function(item) {
      return item.id;
    };
    this.icons = {
      groupLoading:
        '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/javascript-grid-server-side-model/spinner.gif" style="width:22px;height:22px;">'
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
	
       this.sampleService.sampleDatabase$.subscribe((r)=>{
		
		this.rowData = r;
		
		
		})
  }
  
  onCellDoubleClicked(event)
  {
	//console.log(event);
	 if(event.column.colId == 'id')  this.router.navigate(['/sample/'+event.data.id]);
	 if(event.column.colId == 'created_at')  this.router.navigate(['/sample/'+event.data.id]);
	 if(event.column.colId == 'creator')  this.router.navigate(['/sample/'+event.data.id]);
	 if(event.column.colId == 'containers')  this.router.navigate(['/sample/'+event.data.id]);
	 if(event.column.colId == 'created_by')  this.router.navigate(['/sample/'+event.data.id]);
  
  
  }
  
  
  onCellEditingStarted(event)
  {
	console.log(event);
	this.cellOldValue = event.value;  
  }
  
  deleteSample(params)
  {
  
	  if(confirm("Are you sure to delete this sample?")) {
		this.sampleService.delete(params.data.id).subscribe((r)=>{
		this.rowData.splice(params.rowIndex,1);
		this.gridApi.setRowData(this.rowData);
		
		
		});
	  }
	//alert('test');
  }
  
  onCellEditingStopped(event) {
  
	if(this.cellOldValue != event.value)
	{
		console.log(event);
		let params:any  = {};
		params[event.column.colId] = event.value;  
		this.sampleService.update(event.data.id,params).subscribe((r)=>{
			
			
				
			
		});
	}
  }
  
  testChange(e)
  {
	console.log(e);
  }
  
   onAddRow() {
   
  this.sampleService.create({}).subscribe((r)=>{
	  this.rowData.splice(0,0,r);
		this.gridApi.setRowData(this.rowData);
	//	this.gridApi.updateRowData({ add: [r] });
		
	  
	  });
   
   
  
  }

  ngOnInit() {
    
	  this.sampleService.getDatabase({});
    

  }

    
   ngOnDestroy()
   
   {
   
   
   }
  
}

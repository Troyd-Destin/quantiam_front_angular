
import {  AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

import { MaterialLotContainerDatatableService } from '../services/material-lot-container-datatable.service';

import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-material-container-database',
  templateUrl: './material-container-database.component.html',
  styleUrls: ['./material-container-database.component.css']
})
export class MaterialContainerDatabaseComponent implements OnInit {
	
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};   
  

   constructor(private http: HttpClient,public router: Router,private materialLotContainerDatatable: MaterialLotContainerDatatableService) {}
   
  someClickHandler(info: any): void {
       this.router.navigate(['/material/container/'+info.id]);
  }

  _materialLotContainerDatatable = null;
  forceRefreshTable = false;

  ngOnInit() {
  
  
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      serverSide: true,
      processing: true,
      searchDelay: 500,
      ajax:(dataTablesParameters: any, callback) => {
	  
		console.log(dataTablesParameters);
	  
        this.materialLotContainerDatatable.getMaterialLotContainerDatatable(dataTablesParameters,null);
                
        if(!this._materialLotContainerDatatable) this._materialLotContainerDatatable = this.materialLotContainerDatatable.materialLotContainerDatatable$.subscribe(resp => {
        
          if(typeof resp.data !== 'undefined'){

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
              draw: resp.draw,
            }); 
            }
          });
		  
		  console.log('test');
      
      },    
      columns: [
               
            {  
              title: 'Code',
              data: 'datamatrix', "width": "1%", 
              orderable:  false,
              searchable: false,
              render: function (data,type,row,meta){
                return '<img src="'+data+'" width="25px">';
                }                  
            },
             {
              data: 'container_id',
              title: 'ID',
              orderable:true,
              "width": "25px",
             },
			 
			
			 {
              data: 'qcid',
              title: 'QCID',
              orderable:false,
			  searchable: true,
			  visible: true,
			  width: "25px",
			  render: function (data,type,row,meta){
                    if(data) return data.replace('QCID-','').replace('qcid-','');
					
					return '';
                } 
			  
             },
            { data: 'lot.material.name', title:"Material",orderable:true, searchable: true, render: function (data,type,row,meta){ 
              
				if(data) return '<b>'+data+'</b>';
				return '';
			  },
            },
            { data: 'lot.material.grade', title:"Grade",orderable:true,searchable: true},
            { data: 'lot.material.supplier.supplier_name', title:"Supplier",orderable:true,searchable: true, },
            { data: 'lot.lot_name', title:"Lot",orderable:true,searchable: true, },
            { data: 'container_name', title:"Container",orderable:false,  searchable: false, "width": "50px", },
            { data: 'container_number', title:"#",orderable:false,  searchable: false, },
         
       /*      { data: 'amount_ordered', title:"Size",orderable:false, searchable: false,"width": "75px",  render: function (data,type,row,meta){
            
            
                    if(data) return '<b>'+(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+' '+row.denomination+'</b>';
                    return '';
                },    */
                
              { data: 'remaining', title:"Remains",orderable:false, searchable: false, width: "75px",  render: function (data,type,row,meta){            
            
                    if(data) return '<b>'+(data)+' '+row.denomination+'</b>';
                    return '';
                },   
                
              
             }, 
			   { data: 'location.name', title:"Location",orderable:false,  searchable: true,render: function (data,type,row,meta){
                    if(data) return ''+data+'';
                    return '';
                } 
				
			},

             { data: 'active', title:"In Stock?",orderable:false,  searchable: true,render: function (data,type,row,meta){
                    if(row.active == 0) return '';
                    return '<button class="mat-raised-button" style="color:white; background:green; line-height:20px; font-size:12px;     min-width: 50px;">Yes</button>';
                } 
               },
			   
			  
			/* { data: 'active', title:"Left",orderable:false,  searchable: true,render: function (data,type,row,meta){
			
                    if(row.remaining) return '<b>'+(row.remaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+' g</b>';
                    return '';
                } 
				
			}, */
            { data: 'created_at', title: "Created",orderable:true,searchable: false, },
          ],
          
           rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td', row).unbind('click');
                $('td', row).bind('click', () => {
                  self.someClickHandler(data);
                });
                return row;
      }
    };
    
  }
  
  refreshTable()
  {	
	
	
	$.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
	
	 return true;
	
	});
	
	$scope.dtInstance.rerender();
  }
  
  
   ngOnDestroy()
  {
    if(this._materialLotContainerDatatable) this._materialLotContainerDatatable.unsubscribe();
  
    
  }

}

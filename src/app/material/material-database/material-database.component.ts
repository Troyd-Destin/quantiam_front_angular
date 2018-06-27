import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';


import { MaterialDatatableService } from '../services/material-datatable.service';

import { environment } from '../../../environments/environment';

class Material {
  slip_material_id: number;
  datamatrix: string;
  name: string;
  grade: string;
}

class DataTablesMaterialResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-material-database',
  templateUrl: './material-database.component.html',
  styleUrls: ['./material-database.component.css']
})
export class MaterialDatabaseComponent implements OnInit {
  
  dtOptions: DataTables.Settings = {};
  materials: Material[];
  _materialDatatable = null;

   constructor(private http: HttpClient,public router: Router,private materialDatatable: MaterialDatatableService) {}
   
  someClickHandler(info: any): void {
        //console.log(info);
       this.router.navigate(['/material/'+info.id]);
     // this.message = info.id + ' - ' + info.firstName;
  }

  

  ngOnInit() {
  
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      serverSide: true,
      processing: true,
	  searchDelay: 800,
	//  "bDeferRender": true,
	//   "deferLoading": 0,
      ajax: 
         (dataTablesParameters: any, callback) => {
      
   //     console.log(dataTablesParameters);
      
        this.materialDatatable.getMaterialDatatable(dataTablesParameters);
        
        
        if(!this._materialDatatable) this._materialDatatable = this.materialDatatable.materialDatatable$.subscribe(resp => {        
         
            if(typeof resp.data !== 'undefined'){

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
              draw: resp.draw,
            }); 
            }
          });
      
      },    
	  
		/*  	  {url: environment.apiUrl+'/material/list/datatable',
			type: "POST",
      dataType: 'json',
			headers:
			{
			  'Authorization': 'Bearer '+localStorage.getItem('token'),
			}, }   */
		 
    
    
    
      
      columns: [
               
            {    
              title: 'Code',
              data: 'datamatrix', "width": "1%", 
              orderable:false,
              searchable: false,
              render: function (data,type,row,meta){
                return '<img src="'+data+'" width="25px">';
                }                  
            },
            {
              data: 'slip_material_id',
              title: 'ID',
              orderable:false,
              "width": "25px",

            },    
            { data: 'name', title:"Material",orderable:false,searchable:true,"width": "15%",},
            { data: 'formula', title:"Formula",orderable:false, searchable:true},
            { data: 'grade', title:"Grade",orderable:false, "width": "auto",searchable:false},
            { data: 'supplier.supplier_name', title:"Supplier",orderable:false, searchable:false,"width": "auto",},
            
          //  { data: 'catalog', title:"Catalog",orderable:false, searchable:false},
           // { data: 'cas', title:"CAS",orderable:false, searchable:false},
          //  { data: 'density', title:"Density",orderable:false, searchable:false },
            { data: 'created', title: "Created",orderable:false, searchable:false},
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
  
    ngOnDestroy()
  {
    this._materialDatatable.unsubscribe();
  
    
  }

}

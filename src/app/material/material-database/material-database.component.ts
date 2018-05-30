import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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

   constructor(private http: HttpClient,public router: Router,) {}
   
  someClickHandler(info: any): void {
        //console.log(info);
       this.router.navigate(['/material/'+info.id]);
     // this.message = info.id + ' - ' + info.firstName;
  }

  

  ngOnInit() {
  
     const that = this;

  
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      serverSide: true,
      processing: true,
	  searchDelay: 800,
	//  "bDeferRender": true,
	//   "deferLoading": 0,
      ajax: {      
	  
			url: environment.apiUrl+'/material/list/datatable',
			type: "POST",
			headers:
			{
			  'Authorization': 'Bearer '+localStorage.getItem('token'),
			},
		
      },
	  "initComplete": function(settings, json) {
			//console.log( 'DataTables has finished its initialisation.' );
			let  cache = (JSON.parse( localStorage.getItem('test')));
			if(cache) this.fnGetData(cache, false)
				else this.fnDraw();
			console.log(this);
		},
      /*   "fnStateSave": function (oSettings, oData) {
            localStorage.setItem( 'DataTables_'+window.location.pathname, JSON.stringify(oData) );
        },
        "fnStateLoad": function (oSettings) {
            return JSON.parse( localStorage.getItem('DataTables_'+window.location.pathname) );
        }, */
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
            { data: 'name', title:"Material",orderable:false,"width": "15%",},
            { data: 'grade', title:"Grade",orderable:false, "width": "auto",searchable:false},
            { data: 'supplier.supplier_name', title:"Supplier",orderable:false, searchable:false,"width": "auto",},
            { data: 'formula', title:"Formula",orderable:false, searchable:true},
            { data: 'catalog', title:"Catalog",orderable:false, searchable:false},
            { data: 'cas', title:"CAS",orderable:false, searchable:false},
            { data: 'density', title:"Density",orderable:false, searchable:false },
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

}

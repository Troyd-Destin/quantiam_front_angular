
import {  AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

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
 // materials: Material[];

   constructor(private http: HttpClient,public router: Router,) {}
   
  someClickHandler(info: any): void {
        //console.log(info);
       this.router.navigate(['/material/container/'+info.id]);
     // this.message = info.id + ' - ' + info.firstName;
  }

  

  ngOnInit() {
  
     const that = this;

  
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      serverSide: true,
      processing: true,
      searchDelay: 1000,
       //"bDeferRender": true,
      ajax: {
        url: environment.apiUrl+'/material/lot/container/list/datatable',
        type: "POST",
        headers:
        {
          'Authorization': 'Bearer '+localStorage.getItem('token'),
        },
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
              orderable:false,
              "width": "25px",
             },
            { data: 'lot.material.name', title:"Material",orderable:false, searchable: true,"width": "15%", render: function (data,type,row,meta){ 
              
                return '<b>'+data+'</b>';
              },
            },
            { data: 'lot.material.grade', title:"Grade",orderable:false,searchable: true, "width": "20%",},
            { data: 'lot.material.supplier.supplier_name', title:"Supplier",orderable:false,searchable: true, },
            { data: 'lot.lot_name', title:"Lot",orderable:false, },
            { data: 'container_name', title:"Container",orderable:false,  searchable: false, "width": "50px", },
            { data: 'container_number', title:"#",orderable:false,  searchable: false, },
         
            { data: 'amount_ordered', title:"Size",orderable:false, searchable: false,"width": "75px",  render: function (data,type,row,meta){
            
            
                    if(data) return '<b>'+(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+' '+row.denomination+'</b>';
                    return '';
                },   
                
            /*   { data: 'remaining', title:"~ Left",orderable:false, searchable: false, width: "75px",  render: function (data,type,row,meta){            
            
                   // if(data) return '<b>'+(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+' '+row.denomination+'</b>';
                    return '';
                },   
                 */
              
             }, 
             { data: 'location.name', title:"Location",orderable:false,  searchable: true,render: function (data,type,row,meta){
                    if(data) return ''+data+'';
                    return '';
                } },
             { data: 'active', title:"Avail?",orderable:false,  searchable: true,render: function (data,type,row,meta){
                    if(data == 0) return 'No';
                    return 'Yes';
                } 
               },
            { data: 'created_at', title: "Created",orderable:false,searchable: false, },
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

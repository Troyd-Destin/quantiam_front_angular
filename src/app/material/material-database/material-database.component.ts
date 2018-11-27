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
  
  //dtOptions: DataTables.Settings = {};
  materials: Material[];
  _materialDatatable = null;

   constructor(private http: HttpClient,public router: Router,private materialDatatable: MaterialDatatableService) {}
   
  someClickHandler(info: any): void {
        //console.log(info);
       this.router.navigate(['/material/'+info.id]);
     // this.message = info.id + ' - ' + info.firstName;
  }

  

  ngOnInit() {
  
    
  }
  
    ngOnDestroy()
  {
    this._materialDatatable.unsubscribe();
  
    
  }

}

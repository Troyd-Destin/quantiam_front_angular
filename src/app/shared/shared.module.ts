import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng2-select2';
import { Select2MaterialComponent } from './select2-material/select2-material.component';
import { Select2MaterialLotComponent } from './select2-material-lot/select2-material-lot.component';
import { Select2LocationComponent } from './select2-location/select2-location.component';
import { Select2MaterialSupplierComponent } from './select2-material-supplier/select2-material-supplier.component';

@NgModule({
  imports: [
    CommonModule,
    Select2Module,
  ],
  declarations: [Select2MaterialComponent, Select2MaterialLotComponent, Select2LocationComponent, Select2MaterialSupplierComponent],
  exports:[
    Select2MaterialComponent,
    Select2MaterialLotComponent,
    
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class SharedModule { }

import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { FormsModule } from '@angular/forms';


import {FlexLayoutModule} from "@angular/flex-layout";

import {
  MatIconModule,
  MatButtonModule,
  MatCardModule,
   MatCheckboxModule,
    
}  from '@angular/material';

import { Select2Module } from 'ng2-select2';
import { Select2MaterialComponent } from './select2-material/select2-material.component';
import { Select2MaterialLotComponent } from './select2-material-lot/select2-material-lot.component';
import { Select2LocationComponent } from './select2-location/select2-location.component';
import { Select2MaterialSupplierComponent } from './select2-material-supplier/select2-material-supplier.component';
import { Select2UserComponent } from './select2-user/select2-user.component';
import { Select2MaterialLotContainerComponent } from './select2-material-lot-container/select2-material-lot-container.component';

import { SelectProjectComponent } from './select-project/select-project.component';
import { SelectMaterialLotContainerComponent } from './select-material-lot-container/select-material-lot-container.component';
import { SelectUserComponent } from './select-user/select-user.component';

@NgModule({
  imports: [
    CommonModule,
    Select2Module,
	NgSelectModule,
	FormsModule,
	FlexLayoutModule,
	   MatIconModule,
	   MatCardModule,
	   MatButtonModule,
	    MatCheckboxModule,
  ],
  declarations: [SelectProjectComponent,Select2MaterialComponent, Select2MaterialLotComponent, Select2LocationComponent, Select2MaterialSupplierComponent, Select2UserComponent, Select2MaterialLotContainerComponent, SelectMaterialLotContainerComponent, SelectUserComponent],
  exports:[
    Select2MaterialComponent,
    Select2MaterialLotComponent,
	Select2MaterialSupplierComponent,
	Select2LocationComponent,
	Select2UserComponent,
	SelectProjectComponent,
    
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class SharedModule { }

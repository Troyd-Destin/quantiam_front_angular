import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleIndexComponent } from './sample-index/sample-index.component';

import {FlexLayoutModule} from "@angular/flex-layout";

import { DataTablesModule } from 'angular-datatables';


import {
	MatButtonModule, MatCheckboxModule,MatDatepickerModule,MatFormFieldModule,
	MatInputModule,MatNativeDateModule,MatCardModule,MatSidenavModule,
	MatToolbarModule,MatTabsModule,MatGridListModule,MatListModule,MatIconModule,MatExpansionModule,MatDividerModule  } from '@angular/material';
import { SampleListComponent } from './sample-list/sample-list.component';
import { SampleComponent } from './sample/sample.component';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { SampleDatabaseComponent } from './sample-database/sample-database.component';
import { SgxScaleAuthComponent } from './sgx-scale-auth/sgx-scale-auth.component';


@NgModule({
  imports: [
    CommonModule,
    SampleRoutingModule,
	 FlexLayoutModule,
     DataTablesModule,
    	MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		MatCardModule,
		MatSidenavModule,
		MatToolbarModule,
		MatTabsModule,
		MatDividerModule,		
		MatGridListModule,
		MatIconModule,
		MatListModule,
		MatExpansionModule,
		
  ],
  declarations: [SampleIndexComponent, SampleListComponent, SampleComponent, SampleFormComponent, SampleDatabaseComponent, SgxScaleAuthComponent]
})
export class SampleModule { }

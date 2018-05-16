import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleIndexComponent } from './sample-index/sample-index.component';


import {
	MatButtonModule, MatCheckboxModule,MatDatepickerModule,MatFormFieldModule,
	MatInputModule,MatNativeDateModule,MatCardModule,MatSidenavModule,
	MatToolbarModule,MatTabsModule,MatGridListModule,MatListModule,MatIconModule,MatExpansionModule,MatDividerModule  } from '@angular/material';
import { SampleListComponent } from './sample-list/sample-list.component';
import { SampleComponent } from './sample/sample.component';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { SampleDatabaseComponent } from './sample-database/sample-database.component';


@NgModule({
  imports: [
    CommonModule,
    SampleRoutingModule,
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
  declarations: [SampleIndexComponent, SampleListComponent, SampleComponent, SampleFormComponent, SampleDatabaseComponent]
})
export class SampleModule { }

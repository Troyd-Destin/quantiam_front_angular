import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';



import {
	MatButtonModule, MatCheckboxModule,MatDatepickerModule,MatFormFieldModule,
	MatInputModule,MatNativeDateModule,MatCardModule,MatSidenavModule,
	MatToolbarModule,MatTabsModule,MatGridListModule,MatListModule,MatIconModule,MatExpansionModule,MatDividerModule  } from '@angular/material';


import { RouterModule, Routes } from '@angular/router';



import { HeaderComponent } from './header/header.component';
import { CoreComponent } from './core.component';


@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,	
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
  exports:[
	RouterModule,
	HeaderComponent,
  ],
  declarations: [
	HeaderComponent,	
	CoreComponent
	],
	providers:[
	
	]
})
export class CoreModule { }

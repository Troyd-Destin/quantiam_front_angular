import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../services/websocket/websocket.service'; 


//window.websocketService = new WebsocketService(); //initialize websocket here for some reason


import { CoreRoutingModule } from './core-routing.module';

import { Select2Module } from 'ng2-select2';

import { MaterialDesignModule } from '../material-design/material-design.module';
	

import { RouterModule, Routes } from '@angular/router';



import { HeaderComponent } from './header/header.component';
import { CoreComponent } from './core.component';


@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,	
	MaterialDesignModule,
	Select2Module,
  ],
  exports:[
	RouterModule,
	HeaderComponent,
  ],
  declarations: [
	HeaderComponent,	
	CoreComponent
	],
	bootstrap:[CoreComponent],
	
	providers:[]
})
export class CoreModule { }

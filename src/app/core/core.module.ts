import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { CoreRoutingModule } from './core-routing.module';

import { Select2Module } from 'ng2-select2';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { HttpClientModule, HttpClient,HTTP_INTERCEPTORS} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
; 

import { HeaderComponent } from './header/header.component';
import { CoreComponent } from './core.component';
import { PatchNotesComponent } from './patch-notes/patch-notes.component';

import { TokenInterceptor } from '../auth/token.interceptor';

@NgModule({
  imports: [
	CommonModule,
	CoreRoutingModule,	
	MaterialDesignModule,
	Select2Module,
	MarkdownModule.forRoot({ loader: HttpClient }),
	HttpClientModule,
  ],
  exports:[
		RouterModule,
		HeaderComponent,
  ],
  declarations: [
		HeaderComponent,	
		CoreComponent, 
		PatchNotesComponent
	],
	bootstrap:[CoreComponent],
	
	providers:[{
		provide: HTTP_INTERCEPTORS,
		useClass: TokenInterceptor,
		multi: true
	  },]
})
export class CoreModule { }

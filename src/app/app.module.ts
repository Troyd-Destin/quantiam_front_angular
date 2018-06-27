import { environment } from '../environments/environment';

import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

import { TokenInterceptor } from './auth/token.interceptor';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { JwtModule  } from '@auth0/angular-jwt';
//
import { NgModule } from '@angular/core';
import {
	MatButtonModule, MatCheckboxModule,MatDatepickerModule,
	MatInputModule,MatNativeDateModule,MatCardModule,MatSidenavModule,
	MatToolbarModule,MatTabsModule,MatGridListModule,MatListModule,MatIconModule,MatSnackBarModule,
  MatExpansionModule,MatDividerModule,MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';

import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
 import { SimpleNotificationsModule } from 'angular2-notifications';
  
  
  import { WebsocketService } from './services/websocket/websocket.service'; 

  
import { Routes, RouterModule } from '@angular/router';
import { Observable} from 'rxjs';

//
//import { CoreModule } from './core/core.module';
//
//

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '',
    loadChildren: './core/core.module#CoreModule',
    canLoad: [AuthGuardService],
  },  

];


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
        
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,   
    HttpClientModule,
    NgHttpLoaderModule,
    SimpleNotificationsModule.forRoot(),   
    JwtModule.forRoot({
      
         config:{
         
         tokenGetter: () => {
          return localStorage.getItem('token');
          },
          whitelistedDomains: [environment.apiUrl],
          blacklistedRoutes: [environment.apiUrl+'/auth']
        } 
      
      }), 
    
  
   
    //Angular Material Modules 
    MatButtonModule,
		MatCheckboxModule,//
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
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  providers: [
    AuthService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },WebsocketService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
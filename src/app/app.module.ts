import { environment } from '../environments/environment';

import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

import { TokenInterceptor } from './auth/token.interceptor';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {LicenseManager} from 'ag-grid-enterprise/main';
// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('Evaluation_License_Not_For_Production_Valid_Until3_February_2019__MTU0OTE1MjAwMDAwMA==4219b0917c51680a5c4bde17186c5c08');


import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { JwtModule  } from '@auth0/angular-jwt';
import { NgModule } from '@angular/core';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';


import { WebsocketService } from './services/websocket/websocket.service';
import { Routes, RouterModule, RouteReuseStrategy  } from '@angular/router';
import { CustomReuseStrategy } from './reuse-strategy';



import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { CoreModule } from './core/core.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialDesignModule } from './material-design/material-design.module';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    data: {name:"Auth"},
  },
  {
    path: '',
    loadChildren: './core/core.module#CoreModule',
    canLoad: [AuthGuardService],
  },

];


export function gettoken () {
  return localStorage.getItem('token');
  }

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
    NgHttpLoaderModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    JwtModule.forRoot({

         config: {
         tokenGetter: gettoken,
          whitelistedDomains: [environment.apiUrl],
          blacklistedRoutes: [environment.apiUrl + '/auth']
        }

      }),


    MaterialDesignModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    WebsocketService,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { environment } from '../environments/environment';

import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

import { TokenInterceptor } from './auth/token.interceptor';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { HighchartsChartModule } from 'highcharts-angular';


import {LicenseManager} from 'ag-grid-enterprise/main';

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('Evaluation_License_Not_For_Production_13_November_2019__MTU3MzYwMzIwMDAwMA==1d5643fcff17c78b7eb9e3341b0df45f');


import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { JwtModule  } from '@auth0/angular-jwt';
import { NgModule } from '@angular/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


import { WebsocketService } from './services/websocket/websocket.service';
import { Routes, RouterModule, RouteReuseStrategy  } from '@angular/router';
import { CustomReuseStrategy } from './reuse-strategy';



import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialDesignModule } from './material-design/material-design.module';
import { AutoFocusDirective } from './directives/auto-focus.directive';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    data: {key: 'Auth'},
  },
  {
    path: '',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
   // pathMatch: 'prefix',
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
    
  //  AutoFocusDirective,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    JwtModule.forRoot({

         config: {
         tokenGetter: gettoken,
          whitelistedDomains: [environment.apiUrl],
          blacklistedRoutes: [environment.apiUrl + '/auth']
        }

      }),


    MaterialDesignModule,
    HighchartsChartModule,
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

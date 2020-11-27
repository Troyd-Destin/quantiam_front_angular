import { environment } from '../environments/environment';
import { FileSaverModule } from 'ngx-filesaver';
import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

import { TokenInterceptor } from './auth/token.interceptor';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { HighchartsChartModule } from 'highcharts-angular';




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

import { DisconnectionScreenComponent } from './auth/disconnection-screen/disconnection-screen.component';
const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    data: {key: 'Auth'},
  },  
  {
    path: 'disconnected',
    component: DisconnectionScreenComponent,
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
    
		DisconnectionScreenComponent,
    
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
         // whitelistedDomains: [environment.apiUrl],
         // blacklistedRoutes: [environment.apiUrl + '/auth']
        }

      }),

    FileSaverModule,
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
  bootstrap: [AppComponent]
})
export class AppModule { }

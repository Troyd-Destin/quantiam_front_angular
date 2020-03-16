import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from '@ag-grid-enterprise/core';
LicenseManager.setLicenseKey('[TRIAL]_9_May_2020_[v2]_MTU4ODk4MjQwMDAwMA==0e7809f5959896e0fda5b20de768d01a');


import 'angular2-notifications';
//import * as jquery from 'jquery';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

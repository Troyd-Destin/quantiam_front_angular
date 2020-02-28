import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from '@ag-grid-enterprise/core';
LicenseManager.setLicenseKey('Evaluation_License_Not_For_Production_13_November_2019__MTU3MzYwMzIwMDAwMA==1d5643fcff17c78b7eb9e3341b0df45f');


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

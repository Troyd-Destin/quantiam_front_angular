import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule  } from '@angular/router';

import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridModule } from '@ag-grid-community/angular';
import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { NcrDatabaseComponent } from './ncr-database/ncr-database.component';
import { NcrComponent } from './ncr/ncr.component';
import { QualityIndexComponent } from './quality-index/quality-index.component';
import { CarComponent } from './car/car.component';
import { CarDialogComponent } from './car-dialog/car-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: QualityIndexComponent,
    children: [
      {
        path:'',
        redirectTo: 'ncr/database',
      },
      {
        path: 'ncr/database',
        component: NcrDatabaseComponent,
        data: {key: 'NcrDatabase'}
      },
      {
        path: 'ncr/:id',
        component: NcrComponent,
        data: {key: 'NCR'}
      }
    ],

  }

];

@NgModule({
  declarations: [NcrDatabaseComponent, NcrComponent,QualityIndexComponent, CarComponent, CarDialogComponent],
  imports: [    
    RouterModule.forChild(routes),
    CommonModule,
    MaterialDesignModule,
    SharedModule,
    HighchartsChartModule,
  	AgGridModule.withComponents([]),
  ]
})
export class QualityModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapecastDatabaseComponent } from './tapecast-database/tapecast-database.component';
import { TapecastComponent } from './tapecast/tapecast.component';

// Modules
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [ {
  path: '',
  component: TapecastDatabaseComponent,
  children: []
}
];

@NgModule({
  declarations: [TapecastDatabaseComponent, TapecastComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HighchartsChartModule,
    SharedModule,
    MaterialDesignModule,
  ]
})
export class TapecastModule { }



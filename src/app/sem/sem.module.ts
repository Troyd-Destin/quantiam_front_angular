import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule  } from '@angular/router';

// Modules
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';


// Components
import { SemIndexComponent } from './sem-index/sem-index.component';
import { SemDatabaseComponent } from './sem-database/sem-database.component';
import { SemRunComponent } from './sem-run/sem-run.component';


const routes: Routes = [


];

@NgModule({
  declarations: [SemIndexComponent, SemDatabaseComponent, SemRunComponent],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    HighchartsChartModule,
    SharedModule,
    MaterialDesignModule
  ]
})
export class SemModule { }


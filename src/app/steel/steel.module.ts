import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteelIndexComponent } from './steel-index/steel-index.component';
import { SteelDatabaseComponent } from './steel-database/steel-database.component';
import { SteelViewComponent } from './steel-view/steel-view.component';
import { SteelCreationDialogComponent } from './steel-creation-dialog/steel-creation-dialog.component';
import { SteelReworkDialogComponent } from './steel-rework-dialog/steel-rework-dialog.component';

import { Routes, RouterModule  } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';


const routes: Routes = [
  {
    path: '',
    component: SteelIndexComponent,
    children: [

      {
        path: 'database',
        component: SteelDatabaseComponent,
        data: {key: 'SeelDatabase'}
      },
      {
        path: ':id',
        component: SteelViewComponent,
        data: {key: 'SteelView'}
      }
    ],

  }

];



@NgModule({
  imports: [
    CommonModule,
    
    SharedModule,
    MaterialDesignModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SteelIndexComponent, SteelDatabaseComponent, SteelViewComponent, SteelCreationDialogComponent, SteelReworkDialogComponent]
})
export class SteelModule { }

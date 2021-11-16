import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';

import { Routes, RouterModule } from '@angular/router';
import { SlipDatabaseComponent } from './slip-database/slip-database.component';
import { SlipComponent } from './slip/slip.component';
import { SlipRecipeDatabaseComponent } from './slip-recipe-database/slip-recipe-database.component';
import { SlipRecipeComponent } from './slip-recipe/slip-recipe.component';

const routes: Routes = [ {
    path: '',
    component: SlipDatabaseComponent,
    children: []
}
  ];

@NgModule({
  declarations: [SlipDatabaseComponent, SlipComponent, SlipRecipeDatabaseComponent, SlipRecipeComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HighchartsChartModule,
    SharedModule,
    MaterialDesignModule,
  ]
})
export class SlipModule { }

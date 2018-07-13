import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { XpsIndexComponent } from './xps-index/xps-index.component';
import { XpsDatabaseComponent } from './xps-database/xps-database.component';
import { XpsViewComponent } from './xps-view/xps-view.component';


const routes: Routes = [
{
    path:'',
    component: XpsIndexComponent,
},
{
   path:'database',
   component: XpsDatabaseComponent,
}
     // redirectTo: '/database',

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XpsRoutingModule { }

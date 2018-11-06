import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToolsIndexComponent } from './tools-index/tools-index.component';

import { ToolsScalebarComponent } from './tools-scalebar/tools-scalebar.component';

const routes: Routes = [
  {path:'',
    component: ToolsIndexComponent,
    // redirectTo: '/database',
    children:[
       {
        path:'scale-bar',
        component: ToolsScalebarComponent,
       }, 
    ]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }

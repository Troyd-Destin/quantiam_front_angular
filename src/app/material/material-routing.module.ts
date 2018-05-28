import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialCreationDialogComponent } from './material-creation-dialog/material-creation-dialog.component';
import { MaterialIndexComponent } from './material-index/material-index.component';
import { MaterialDatabaseComponent } from './material-database/material-database.component';
import { MaterialViewComponent } from './material-view/material-view.component';
import { MaterialContainerDatabaseComponent } from './material-container-database/material-container-database.component';
import { MaterialContainerViewComponent } from './material-container-view/material-container-view.component';
import { MaterialComponent } from './material.component';

const routes: Routes = [ 
  {
    path:'',
    component: MaterialIndexComponent,
     // redirectTo: '/database',
      children:[
        
		 {
          path:'container/database',
          component: MaterialContainerDatabaseComponent,
         }, 
		 {
          path:'container/:id',
          component: MaterialContainerViewComponent,
         },
		 {
          path:'database',
          component: MaterialDatabaseComponent,
         },
         {
          path:'create',
          component: MaterialCreationDialogComponent
        
        },
        {
		  //name: 'material_view',
          path:':id',
          component: MaterialViewComponent
  
        },
        
  
  
        
      ]
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }

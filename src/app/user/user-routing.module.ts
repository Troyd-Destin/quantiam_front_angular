import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



import { UserIndexComponent } from './user-index/user-index.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserViewPermissionsComponent } from './user-view-permissions/user-view-permissions.component';
import { UserViewKeycardComponent } from './user-view-keycard/user-view-keycard.component';
import { UserViewMachinesComponent } from './user-view-machines/user-view-machines.component';
import { UserDatabaseComponent } from './user-database/user-database.component';

const routes: Routes = [
  {
    path:'',
    component: UserIndexComponent,
     // redirectTo: '/database',
      children:[        
         {
              path:'database',
              component: UserDatabaseComponent,
         }, 
         {		 
              path:':id',
              component: UserViewComponent,
              pathMatch: 'full',
              children:[
                {
                  path:'permissions',
                  component: UserViewPermissionsComponent
                }, 
                {
                  path:'machines',
                  component: UserViewMachinesComponent
                },
                {
                  path:'keycard',
                  component: UserViewKeycardComponent
                },   
                
        ] 
       },     
        
      ]
  },
  
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

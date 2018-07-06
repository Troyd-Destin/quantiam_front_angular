import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
const routes: Routes = [

	{ 
		path:'',
		component: CoreComponent,
		children:[		
			
			{
				path: 'material',
				loadChildren: '../material/material.module#MaterialModule',
			},
			{
				path: 'sample',
				loadChildren: '../sample/sample.module#SampleModule',
			},
			{
				path: 'user',
				loadChildren: '../user/user.module#UserModule',
			},
		]
	},
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

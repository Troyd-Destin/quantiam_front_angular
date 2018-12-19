import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
import { PatchNotesComponent } from './patch-notes/patch-notes.component';

const routes: Routes = [

	{ 
		path:'',
		component: CoreComponent,
		children:[				
			{
				path:'',
				redirectTo: 'home',
			},
			{
				path:'home',
				component: PatchNotesComponent,
				
			},
			{
				path: 'material',
				loadChildren: '../material/material.module#MaterialModule',
				//pathMatch: 'prefix',
			},
			{
				path: 'sample',
				loadChildren: '../sample/sample.module#SampleModule',
			//	pathMatch: 'prefix',
			},
			{
				path: 'user',
				loadChildren: '../user/user.module#UserModule',
			//	pathMatch: 'prefix',
			},
			{
				path: 'xps',
				loadChildren: '../xps/xps.module#XpsModule',
			//	pathMatch: 'prefix',
			},
			{
				path: 'tools',
				loadChildren: '../tools/tools.module#ToolsModule',
				//pathMatch: 'prefix',
			},
			{
				path:'timesheet',
				loadChildren: '../timesheet/timesheet.module#TimesheetModule',
				//pathMatch: 'prefix',

			},
			{
				path:'sgx',
				loadChildren: '../sgx/sgx.module#SgxModule',
				//pathMatch: 'prefix',

			},
		]
	},
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

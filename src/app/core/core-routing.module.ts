import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
import { PatchNotesComponent } from './patch-notes/patch-notes.component';

const routes: Routes = [

	{
		path: '',
		component: CoreComponent,
		children: [
			{
				path: '',
				redirectTo: 'home',
			},
			{
				path: 'home',
				component: PatchNotesComponent,

			},
			{
				path: 'material',
				loadChildren: () => import('../material/material.module').then(m => m.MaterialModule),
				// pathMatch: 'prefix',
			},
			{
				path: 'sample',
				loadChildren: () => import('../sample/sample.module').then(m => m.SampleModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'user',
				loadChildren: () => import('../user/user.module').then(m => m.UserModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'sem',
				loadChildren: () => import('../sem/sem.module').then(m => m.SemModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'steel',
				loadChildren: () => import('../steel/steel.module').then(m => m.SteelModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'xps',
				loadChildren: () => import('../xps/xps.module').then(m => m.XpsModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'xrd',
				loadChildren: () => import('../xrd/xrd.module').then(m => m.XrdModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'tga',
				loadChildren: () => import('../tga/tga.module').then(m => m.TgaModule),
			// 	pathMatch: 'prefix',
			},
			{
				path: 'tools',
				loadChildren: () => import('../tools/tools.module').then(m => m.ToolsModule),
				// pathMatch: 'prefix',
			},
			{
				path: 'timesheet',
				loadChildren: () => import('../timesheet/timesheet.module').then(m => m.TimesheetModule),
				// pathMatch: 'prefix',

			},
			{
				path: 'sgx',
				loadChildren: () => import('../sgx/sgx.module').then(m => m.SgxModule),
				// pathMatch: 'prefix',

			},
			{
				path: 'arbin',
				loadChildren: () => import('../arbin/arbin.module').then(m => m.ArbinModule),
				// pathMatch: 'prefix',

			},
		]
	},

	{path: '**', redirectTo: 'home'},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

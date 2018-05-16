import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
const routes: Routes = [

	{ 
		path:'',
		component: CoreComponent,
		children:[		
			{
				path: 'sample',
				loadChildren: '../sample/sample.module#SampleModule',
			}
		]
	},
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

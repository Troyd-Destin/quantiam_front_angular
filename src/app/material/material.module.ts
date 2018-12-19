import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../services/material/material.service';
import { MaterialLotContainerService } from '../services/material-lot-container/material-lot-container.service';
import { MaterialDatatableService } from './services/material-datatable.service';
import { MaterialLotContainerDatatableService } from './services/material-lot-container-datatable.service';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../services/websocket/websocket.service';

import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';


import { Select2Module } from 'ng2-select2';
// import { DataTablesModule } from 'angular-datatables';

import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialCreationDialogComponent } from './material-creation-dialog/material-creation-dialog.component';
import { MaterialIndexComponent } from './material-index/material-index.component';
import { MaterialDatabaseComponent } from './material-database/material-database.component';
import { MaterialViewComponent } from './material-view/material-view.component';
import { MaterialComponent } from './material.component';
import { MaterialContainerViewComponent } from './material-container-view/material-container-view.component';
import { MaterialContainerDatabaseComponent } from './material-container-database/material-container-database.component';
import { AggridActiveParentComponent } from './aggrid-active-parent/aggrid-active-parent.component';
import { AggridActiveComponent } from './aggrid-active/aggrid-active.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  	SharedModule,
  	MaterialDesignModule,
    MaterialRoutingModule,
  	// DataTablesModule,
    Select2Module,
    AgGridModule.withComponents([AggridActiveParentComponent]),
  ],
  declarations: [MaterialCreationDialogComponent, MaterialIndexComponent, MaterialDatabaseComponent, MaterialViewComponent,
	  MaterialComponent, MaterialContainerViewComponent, MaterialContainerDatabaseComponent, AggridActiveParentComponent, AggridActiveComponent],
  providers: [MaterialService, MaterialLotContainerService, MaterialDatatableService, MaterialLotContainerDatatableService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MaterialModule { }

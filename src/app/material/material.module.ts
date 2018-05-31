import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../services/material/material.service';
import { MaterialLotContainerService } from '../services/material-lot-container/material-lot-container.service';
import { FormsModule } from '@angular/forms';

import {FlexLayoutModule} from "@angular/flex-layout";

import { DataTablesModule } from 'angular-datatables';

import { SharedModule } from '../shared/shared.module';

import {
	MatButtonModule, MatCheckboxModule,MatDatepickerModule,MatFormFieldModule,
	MatInputModule,MatNativeDateModule,MatCardModule,MatSidenavModule,
	MatToolbarModule,MatTabsModule,MatGridListModule,MatListModule,MatIconModule,MatExpansionModule,MatDividerModule,MatDialogModule  } from '@angular/material';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialCreationDialogComponent } from './material-creation-dialog/material-creation-dialog.component';
import { MaterialIndexComponent } from './material-index/material-index.component';
import { MaterialDatabaseComponent } from './material-database/material-database.component';
import { MaterialViewComponent } from './material-view/material-view.component';
import { MaterialComponent } from './material.component';
import { MaterialContainerViewComponent } from './material-container-view/material-container-view.component';
import { MaterialContainerDatabaseComponent } from './material-container-database/material-container-database.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
	SharedModule,
    MaterialRoutingModule,
     FlexLayoutModule,
     DataTablesModule,
    MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		MatCardModule,
		MatSidenavModule,
		MatToolbarModule,
		MatTabsModule,
		MatDividerModule,		
		MatGridListModule,
		MatIconModule,
		MatListModule,
		MatExpansionModule,
    MatDialogModule,
  ],
  declarations: [MaterialCreationDialogComponent, MaterialIndexComponent, MaterialDatabaseComponent, MaterialViewComponent, MaterialComponent, MaterialContainerViewComponent, MaterialContainerDatabaseComponent],
  providers: [MaterialService,MaterialLotContainerService],
})
export class MaterialModule { }
//
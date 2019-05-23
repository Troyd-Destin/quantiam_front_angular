import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteelIndexComponent } from './steel-index/steel-index.component';
import { SteelDatabaseComponent } from './steel-database/steel-database.component';
import { SteelViewComponent } from './steel-view/steel-view.component';
import { SteelCreationDialogComponent } from './steel-creation-dialog/steel-creation-dialog.component';
import { SteelReworkDialogComponent } from './steel-rework-dialog/steel-rework-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SteelIndexComponent, SteelDatabaseComponent, SteelViewComponent, SteelCreationDialogComponent, SteelReworkDialogComponent]
})
export class SteelModule { }

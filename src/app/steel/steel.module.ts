import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteelIndexComponent } from './steel-index/steel-index.component';
import { SteelDatabaseComponent } from './steel-database/steel-database.component';
import { SteelViewComponent } from './steel-view/steel-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SteelIndexComponent, SteelDatabaseComponent, SteelViewComponent]
})
export class SteelModule { }

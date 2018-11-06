import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MaterialDesignModule } from '../material-design/material-design.module';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsIndexComponent } from './tools-index/tools-index.component';
import { ToolsScalebarComponent } from './tools-scalebar/tools-scalebar.component';

@NgModule({
  imports: [
    CommonModule,
    ToolsRoutingModule,
    MaterialDesignModule
  ],
  declarations: [ToolsIndexComponent, ToolsScalebarComponent]
})
export class ToolsModule { }

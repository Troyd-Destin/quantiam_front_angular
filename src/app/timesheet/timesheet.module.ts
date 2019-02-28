import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from 'ng-fullcalendar';


import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetIndexComponent } from './timesheet-index/timesheet-index.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetBankComponent } from './timesheet-bank/timesheet-bank.component';
import { TimesheetSimpleComponent } from './timesheet-simple/timesheet-simple.component';
import { TimesheetCalendarComponent } from './timesheet-calendar/timesheet-calendar.component';
import { TimesheetRtoComponent } from './timesheet-rto/timesheet-rto.component';
import { TimesheetRtoViewComponent } from './timesheet-rto-view/timesheet-rto-view.component';

import { NumericEditor } from './timesheet/numeric-editor.component';
//import { MoodEditor } from '../ag-grid-editors/mood-editor.component';
import { TimesheetReportsComponent } from './timesheet-reports/timesheet-reports.component';

@NgModule({
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    
    MaterialDesignModule,
    SharedModule
  ],
  declarations: [ NumericEditor, TimesheetIndexComponent, TimesheetComponent, TimesheetBankComponent, TimesheetSimpleComponent, TimesheetCalendarComponent, TimesheetRtoComponent, TimesheetRtoViewComponent, TimesheetReportsComponent]
})
export class TimesheetModule { }

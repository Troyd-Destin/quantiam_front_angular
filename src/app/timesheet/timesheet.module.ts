import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetIndexComponent } from './timesheet-index/timesheet-index.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetBankComponent } from './timesheet-bank/timesheet-bank.component';
import { TimesheetSimpleComponent } from './timesheet-simple/timesheet-simple.component';
import { TimesheetCalendarComponent } from './timesheet-calendar/timesheet-calendar.component';
import { TimesheetRtoComponent } from './timesheet-rto/timesheet-rto.component';
import { TimesheetRtoViewComponent } from './timesheet-rto-view/timesheet-rto-view.component';

@NgModule({
  imports: [
    CommonModule,
    TimesheetRoutingModule
  ],
  declarations: [TimesheetIndexComponent, TimesheetComponent, TimesheetBankComponent, TimesheetSimpleComponent, TimesheetCalendarComponent, TimesheetRtoComponent, TimesheetRtoViewComponent]
})
export class TimesheetModule { }

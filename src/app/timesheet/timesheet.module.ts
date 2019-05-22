import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from 'ng-fullcalendar';

import { HotTableModule } from '@handsontable/angular';


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
import { TimesheetProjectComponent } from './timesheet-project/timesheet-project.component';
import { TimesheetHolidayComponent } from './timesheet-holiday/timesheet-holiday.component';
import { TimesheetRtoAllocationComponent } from './timesheet-rto-allocation/timesheet-rto-allocation.component';
import { TimesheetReportComponent } from './timesheet-report/timesheet-report.component';
import { UserHoursComponent } from './timesheet-report/user-hours/user-hours.component';
import { ProjectUserHoursComponent } from './timesheet-report/project-user-hours/project-user-hours.component';
import { UserRTOBankStatusComponent } from './timesheet-report/user-rtobank-status/user-rtobank-status.component';
import { UserAbsenceSummaryComponent } from './timesheet-report/user-absence-summary/user-absence-summary.component';
import { TimesheetSettingsComponent } from './timesheet-settings/timesheet-settings.component';
import { CreateRtoDialogComponent } from './create-rto-dialog/create-rto-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    
    HotTableModule.forRoot(),
    
    MaterialDesignModule,
    SharedModule
  ],
  entryComponents:[ CreateRtoDialogComponent ],
  declarations: [ NumericEditor, TimesheetIndexComponent, TimesheetComponent, 
    TimesheetBankComponent, TimesheetSimpleComponent, TimesheetCalendarComponent, TimesheetRtoComponent, TimesheetRtoViewComponent,
     TimesheetProjectComponent, TimesheetHolidayComponent, TimesheetRtoAllocationComponent, TimesheetReportComponent, UserHoursComponent, ProjectUserHoursComponent, UserRTOBankStatusComponent, UserAbsenceSummaryComponent, TimesheetSettingsComponent, CreateRtoDialogComponent]
})
export class TimesheetModule { }

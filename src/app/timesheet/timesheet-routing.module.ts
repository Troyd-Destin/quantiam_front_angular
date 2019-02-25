import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimesheetIndexComponent } from './timesheet-index/timesheet-index.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetBankComponent } from './timesheet-bank/timesheet-bank.component';
import { TimesheetSimpleComponent } from './timesheet-simple/timesheet-simple.component';
import { TimesheetCalendarComponent } from './timesheet-calendar/timesheet-calendar.component';
import { TimesheetRtoComponent } from './timesheet-rto/timesheet-rto.component';
import { TimesheetRtoViewComponent } from './timesheet-rto-view/timesheet-rto-view.component';

const routes: Routes = [{
    path: '',
    component: TimesheetIndexComponent,
    children: [
    {
      path: ':user/year/:year/payperiod/:payperiod',
      data: { key: 'timesheet'},
      component: TimesheetComponent,
    },
    {
      path: 'bank/:type/:user',
      data: { key: 'timesheet-bank'},
      component: TimesheetBankComponent,
    },
    {
      path: 'calendar',
      data: { key: 'timesheet-calendar'},
      component: TimesheetCalendarComponent,
    },
    {
      path: 'rto/database',
      data: { key: 'timesheet-rto-database'},
      component: TimesheetRtoComponent,
    },
    {
      path: 'rto/:id',
      data: { key: 'timesheet-rto-view'},
      component: TimesheetRtoViewComponent,
    },

  ],

}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }

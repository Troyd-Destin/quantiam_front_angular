import { Component, OnInit, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {  HttpClient } from '@angular/common/http';

import {  environment } from '../../../environments/environment';

import { EventInput } from '@fullcalendar/core';

import { UserService } from '../../services/user/user.service';
import dayGridPlugin from '@fullcalendar/daygrid';

import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

@Component({
  selector: 'app-timesheet-calendar',
  templateUrl: './timesheet-calendar.component.html',
  styleUrls: ['./timesheet-calendar.component.css']
})
export class TimesheetCalendarComponent implements OnInit {

 
  subordinatesOnly = false;
  selectedUser;
  minimumHours = 0;
  calendarPlugins = [dayGridPlugin,interactionPlugin,timeGrigPlugin]; // important! //
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() },
    { title: 'Event Now', start: new Date() },
    { title: 'Event Now', start: new Date() },
    { title: 'Event Now', start: new Date() },
    { title: 'Event Now', start: new Date() },
    { title: 'Event Now', start: new Date() },
    { title: 'Event Now', start: new Date() }
  ];
 
  calendarHeader = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  };

  constructor(private router: Router, private http: HttpClient, private userService: UserService) { }

  ngOnInit() {


      setTimeout((x) => {

        console.log('test');

        (<any>$('#calendar')).fullCalendar({

        eventLimit: 5,
				aspectRatio: 10,
        header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        height: 700,
        eventClick: (calEvent, jsEvent, view) => {


          this.router.navigate(['/timesheet/rto/' + calEvent.rto_id]);

        },
        eventSources: [this.eventSourceQuantiam()],
      });

    }, 500);  
  }

  eventClick (calEvent, jsEvent, view) {


    this.router.navigate(['/timesheet/rto/' + calEvent.rto_id]);

  }


  loadRTO(rto) {

     console.log('navigate');

  }

  updateCalendar = function () {
    console.log(this.selectedUser);
    const eventSource = this.eventSourceQuantiam();
    console.log('updated');
    (<any>$('#calendar')).fullCalendar( 'removeEventSource', eventSource.url );
    (<any>$('#calendar')).fullCalendar( 'addEventSource',  this.eventSourceQuantiam());
	};

  eventSourceQuantiam() {

    return  {
      url: environment.apiUrl + '/rtocalendar',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('token'), },
     data: {

                  userID: this.selectedUser,
                  subordinates: this.subordinatesOnly,
                 'minimumHours': this.minimumHours
              },
     color: '#38536f',
     // color: '#5c7a9a;',
    };




  }

  updateSelectedUser(event) {
    if (!event) { this.selectedUser = null; } else { this.selectedUser = event.employeeid; }

    this.updateCalendar();
    // console.log(event);
  }


  printPage() {
    window.print()
  }





}



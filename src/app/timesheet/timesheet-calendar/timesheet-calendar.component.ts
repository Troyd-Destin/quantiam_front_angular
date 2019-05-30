import { Component, OnInit, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {  HttpClient } from '@angular/common/http';

import {  environment } from '../../../environments/environment';


import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-timesheet-calendar',
  templateUrl: './timesheet-calendar.component.html',
  styleUrls: ['./timesheet-calendar.component.css']
})
export class TimesheetCalendarComponent implements OnInit {

  calendarEvents = [];
  subordinatesOnly = false;
  selectedUser;
  minimumHours = 0;

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






}



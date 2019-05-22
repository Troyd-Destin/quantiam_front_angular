import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from '../../services/user/user.service';

import * as moment from 'moment';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-timesheet-rto-view',
    templateUrl: './timesheet-rto-view.component.html',
    styleUrls: ['./timesheet-rto-view.component.css']
})
export class TimesheetRtoViewComponent implements OnInit {

    policyFolderPath = 'Q:\\Administration - All Staff\\HR and EH&S INFORMATION\\POLICIES AND PROCEDURES\\HR POLICIES\\HRD-0003 Paid Leave BV and PTO';

    showTimeOffRequestForm;
    previousTimeRequest = {};

    showSelectBox = false;
    rto;
    routeParams: any;

    requestTime = { date: null, end_hour: null, hours: null, requestID: null, rtotimeID: null, start_hour: null, type: null, };
    timeOptions = [
        '8:00 am', '8:15 am', '8:30 am', '8:45 am',
        '9:00 am', '9:15 am', '9:30 am', '9:45 am',
        '10:00 am', '10:15 am', '10:30 am', '10:45 am',
        '11:00 am', '11:15 am', '11:30 am', '11:45 am',
        '12:00 pm',
        '1:00 pm', '1:15 pm', '1:30 pm', '1:45 pm',
        '2:00 pm', '2:15 pm', '2:30 pm', '2:45 pm',
        '3:00 pm', '3:15 pm', '3:30 pm', '3:45 pm',
        '4:00 pm', '4:15 pm', '4:30 pm', '4:45 pm',
        '5:00 pm',
    ];

    selectedSupervisorToNotifyId;

    editable = false;

    constructor(
        private http: HttpClient,
        private notification: NotificationsService,
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit() {



        this.route.paramMap.subscribe(params => {
            console.log(params);


            this.fetchRtoData(params.get('id'));
            this.showTimeOffRequestForm = false;

        });



    }

    canEdit() {
        // is supervisor & superior has not approved

        // has relevant Permissions

        //
    }

    canApprove() {
        // is supervisor


        // has relevant Permissions


    }

    fetchRtoData(id) {


        this.http.get(environment.apiUrl + '/rto/' + id).subscribe((r) => {

            this.rto = r;
            this.canEdit();
        });


    }

    selectedUserChanged() {


    }

    createTimeRequest() {

        /// requests must be all positive or all negative

        const params = {
            date: this.requestTime.date,
            end_hour: this.requestTime.end_hour,
            hours: this.requestTime.hours,
            requestID: this.requestTime.requestID,
            start_hour: this.requestTime.start_hour,
            type: this.requestTime.type,
        };

        console.log(this.previousTimeRequest, params);
        if (JSON.stringify(this.previousTimeRequest) === JSON.stringify(params)) {
            Swal.fire({
                title: 'Duplicate Request',
                text: 'You\'re trying to create the same thing twice!',
                type: 'warning',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                // cancelButtonColor: '#d33',
                confirmButtonText: 'Hmm...'
            }).then((result) => {});

        } else {

            this.http.post(environment.apiUrl + '/rto/' + this.rto.requestID + '/requestTime', params).subscribe((r) => {

                this.rto.requested_time.push(r);
                this.previousTimeRequest = params;

            });


        }



        // requests must adhere to policy rules

    }

    deleteTimeRequest(timeRequest) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {


                this.http.delete(environment.apiUrl + '/rto/time/' + timeRequest.rtotimeID).subscribe((r) => {

                    this.rto.requested_time = this.rto.requested_time.filter(obj => obj !== timeRequest); // filter for objects that aren't the one we removed
                    // Swal.fire( 'Deleted!',    'Your file has been deleted.',  'success');

                });
            }
        });
    }

    createApproval() {


    }

    deleteApproval() {


    }

    notifySupervisor() {

        // Build date table.
        const dates = [];
        let total_hours = 0;
        let amount_of_days = 0;
        this.rto.requested_time.forEach((data) => {
            const date = '<tr><td align=\'center\'>' + moment(data.date).format('dddd') + '</td><td align=\'center\'>' + moment(data.date).format('MMMM Do, YYYY') + '</td><td align=\'center\'>' + data.hours + ' hrs</td><td align=\'center\'>' + data.type + '</td><td height=0 width=0></td></tr>';
            total_hours = total_hours + data.hours;
            amount_of_days = amount_of_days + 1;
            dates.push(date);
        });

        const table = '<table border="1" cellspacing="2" cellpadding="2" width="550" >' +
            '<th> Day of Week </th> <th> Day  </th><th>Amount</th><th>Type</th><th>Comma</th>' +
            '<tbody>' +
            dates +
            '</tbody></table>';

        const body = '<p><a href=\'' + document.location.href + '\'> View Time-off Request</a></p><b> Total Time  </b>: ' + total_hours + ' Hours <br> <b> Total Days </b> : ' + amount_of_days + '<br><br>' + table + '<br><br><p><i>This message is automatically generated. </i></p>';

        const params = {
            'subject': '[RTO] ' + this.rto.user.name + ' has requested time off.',
            'body': body,
            'recipientID': ['65'],
            // "recipientID": [this.rto.user.id, this.selectedSupervisor.id],

        };
        // 	console.log(params);

        this.http.post(environment.apiUrl + '/mail/send', params).subscribe((r) => {

            // Notified Supervisor
        });
    }

    deleteRTO() {
        // confirm if user wants to delete this entire request?
        Swal.fire({
            title: 'Delete Request ' + this.rto.requestID + '?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
                if (result.value) {
                    // delete the request
                    this.http.delete(environment.apiUrl + '/rto/' + this.rto.requestID).subscribe((r) => {

                        this.router.navigate(['/timesheet/rto/database'], { queryParams: { refresh: 'true', id: this.rto.requestID }, skipLocationChange: true});

                    });
                  }
                });

    }
}

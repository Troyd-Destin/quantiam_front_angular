import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from '../../services/user/user.service';
// Base 64 IMage display issues with unsafe image
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sem-run',
  templateUrl: './sem-run.component.html',
  styleUrls: ['./sem-run.component.css']
})
export class SemRunComponent implements OnInit {

  private semrunID;

  Semrun;
  selectedImage: any;
  selectedSubImage: any;

  constructor(
    private http: HttpClient,
    private notification: NotificationsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private domSanitizer: DomSanitizer,
) {}

ngOnInit() {



  this.route.paramMap.subscribe(params => {
    console.log(params);

    this.semrunID = params.get('id');

    this.fetchSemrunData();
   // this.showTimeOffRequestForm = false;

  });

}

    clearView() {

      this.Semrun = null;
      this.selectedImage = null;
      this.selectedSubImage = null;

    }

    fetchSemrunData() {

          this.clearView();

          this.http.get(environment.apiUrl + '/instrument/sem/run/' + this.semrunID).subscribe((r) => {

              console.log(r);
              this.Semrun = r;

          },
          (error) => {

            this.notification.error('Error', 'This Semrun failed to load.', {timeOut: 2000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton


          });

    }


    selectImage(img) {
      this.selectedImage = img;

      this.selectedImage.assoc_files.forEach(element => {

        if (element.type == 'image') { this.selectedSubImage = element; }

        return;
      });

    }

}

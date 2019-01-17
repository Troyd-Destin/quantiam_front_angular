import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { SgxScaleWebsocketService } from '../services/sgx-scale-websocket/sgx-scale-websocket.service';

import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  providers: [AuthService],
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

   hidePassword = true;
   loginHappening = false;
   ws: any;
   _ws: any;

  constructor(private auth: AuthService, private scale_websocket: SgxScaleWebsocketService,
    public notification: NotificationsService, ) { }

  ngOnInit() {

	  // try {

    //   this.ws = this.scale_websocket.connect();
    // 	 this._ws.subscribe((x) => {


    //       console.log(x);
    //       // if token  login(null,null, rfid);

    //     });

    // } catch (e) {}





  }

  login(username, password, rfid) {
    // console.log(username,password);

    this.loginHappening = true;

    this.notification.info('Authenticating...', 'This may take some time.', {timeOut: 4000, showProgressBar: false, clickToClose: true});

    this.auth.login(username, password, null).subscribe((response) => {
      this.loginHappening = false;
        console.log(response);
        if (response.token) {

           this.auth.token_auth(response.token);

          }
          this.notification.success('Authenticated', 'Seems good.', {timeOut: 4000, showProgressBar: false, clickToClose: true});
      },
      error => {
        this.notification.error('Unauthorized', 'Your credentials are incorrect.', {timeOut: 4000, showProgressBar: false, clickToClose: true});
       
        this.loginHappening = false;
      },
  );

  }


  ngOnDestroy() {
     if (this._ws) { this._ws.unsubscribe(); }
  }


}

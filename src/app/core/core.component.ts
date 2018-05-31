
import { Component,ChangeDetectorRef,OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { catchError, map, tap, delay } from 'rxjs/operators';


import { WebsocketService } from '../services/websocket/websocket.service'; 


interface webSocketMessages {
	
}


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
   providers: [
      MediaMatcher,
      UserService,
	  WebsocketService,
   
  ],
})


	export class CoreComponent implements OnInit {

  


  title = 'app';
  user: {};
  userLoaded: boolean = false;
  userTitle: null;
  userName: null;
  
  webSocketMessages: webSocketMessages;
  lastWebSocketMessage;
  _ws;
  
	options: FormGroup;	
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;	
	

  constructor(
		fb: FormBuilder,
		changeDetectorRef: ChangeDetectorRef, 
		media: MediaMatcher,
		private userService: UserService, 
		private auth: AuthService,
		private websocket: WebsocketService
		
	) {
	  
  
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    
      this.options = fb.group({
        'fixed': false,
        'top': 0,
        'bottom': 0,
      });
      
     // get user data and store in user Variable
      this.userService.getAuthedUser().subscribe(res=>{
        
         this.userTitle = res.title; 
       this.userName = res.name; 
       this.userLoaded = true;
        
        });
     
      //this.user.getUser
  }
  
  
  logout()
  {
  
      
      this.auth.logout();
  
  }
  
  
  
  
  ngOnInit() {
  
    this.websocket.connect();
  
 
 /*      
 
  this.webSocketMessages = {};
	this.lastWebSocketMessage = {};
		let response = JSON.parse(res.data);
		
   
      try{ 
        if(!this.webSocketMessages[response.machine.name]) this.webSocketMessages[response.machine.name] = {};
        
        if(JSON.stringify(this.webSocketMessages[response.machine.name]) === JSON.stringify(response))
        {
          
        }
        else
        {
          this.webSocketMessages[response.machine.name] = response;			
          console.log('Websocket Messages', this.webSocketMessages);
        }
      }
      catch(e){} */

  
  
    
  }
  
   ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  
}

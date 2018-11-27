
import { Component,ChangeDetectorRef,OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { catchError, map, tap, delay } from 'rxjs/operators';


import { WebsocketService } from '../services/websocket/websocket.service'; 
import { SettingsService } from '../services/settings/settings.service'; 


interface webSocketMessages {
	
}


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
   providers: [
      MediaMatcher,
      UserService,
  ],
})


export class CoreComponent implements OnInit {

  


  title = 'app';
  user: {};
  userLoaded: boolean = false;
  userTitle: null;
  userName: null;
  selectedScanner;
  scannerList = [];
  scannerSelect2Options={"theme":"classic"};
 
  
  webSocketMessages: webSocketMessages;
  lastWebSocketMessage;
  _ws;
  _wsk;
  _scannerEvents: any;
   
  isAdmin = false;
  
  
	options: FormGroup;	
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;	
	

  constructor(
		fb: FormBuilder,
		changeDetectorRef: ChangeDetectorRef, 
		media: MediaMatcher,
		private userService: UserService, 
		private auth: AuthService,
		private websocketService: WebsocketService,
		private settings: SettingsService,
		private _location: Location
	) {
	  
	  
	
	
	this.getScanner();
	
  
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
		   this.user = res;
		   this.userLoaded = true;
		   
		   this.adminCheck();
		   
		//   console.log(this.userService.hasPermission(38));
        
        });
     
      //this.user.getUser
  }
  
  adminCheck()
  {
	let adminPermissionArray = [27,28,5,6,7,8,9]; // permission which allow you to see the admin side menu
	
	
	for (var i = 0; i < adminPermissionArray.length; i++) {
		
		
			if(this.userService.hasPermission(adminPermissionArray[i]))
			{
				//console.log(r);
				this.isAdmin = true;
				return;
			}
		}
	
	
	
  
  }
  
  logout()
  {
  
      
      this.auth.logout();
  
  }
  
  updateScanner(obj)
  {
	
	this.selectedScanner = obj.data[0];
	this.settings.set('selectedScanner',this.selectedScanner);
	this.websocketService.selectedScanner = this.selectedScanner;
	
	
  
  }
  
  getScanner()
  {
	this.scannerList = this.websocketService.selectableScanners; //set the selectable list of scanners.
	let savedScanner = this.settings.get('selectedScanner');
	console.log(savedScanner);
	if(savedScanner && savedScanner.id)
	{
		this.selectedScanner = this.settings.get('selectedScanner');
	}
	else {
		this.selectedScanner = this.websocketService.selectableScanners[0];
	}
  
  }
  
  backClicked() {
        this._location.back();
    }
   forwardClicked() {
        this._location.forward();
    }
  
  ngOnInit() {
  
  
	//this.websocketService.connect();
			
	this._scannerEvents = this.websocketService.scannerEvents.subscribe((data)=>{})

    
  }
  
   ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
	   if(this._ws) this._ws.unsubscribe();
  }
  
  
}

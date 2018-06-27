
import { Component,ChangeDetectorRef,OnInit } from '@angular/core';
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
		private settings: SettingsService
		
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
       this.userLoaded = true;
        
        });
     
      //this.user.getUser
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
  
  
  
  ngOnInit() {
  
  
	this.websocketService.connect();
	this._ws = this.websocketService.observable.subscribe((data)=>{
		
	//	console.log('core');
			
		})
   
//setTimeout(function(){this.websocket.toggleRedirectOnScan();},3000);

  
    
  }
  
   ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
	this._ws.unsubscribe();
  }
  
  
}

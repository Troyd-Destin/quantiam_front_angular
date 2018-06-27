import { Injectable } from '@angular/core';
import {Observable, Subject, Observer,BehaviorSubject} from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { catchError, map, tap, delay,share } from 'rxjs/operators';

import { SettingsService } from '../../services/settings/settings.service'; 

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private url = 'ws://api.edm.quantiam.com:8081';
 
  private subject: Subject<MessageEvent>;
  private subjectData: Subject<number>;
  private codeObj;
  private randomNumber = Math.random();
  public observable;
  
//  public _wsSource = new BehaviorSubject({});
 // public ws$: Observable<any> = this._wsSource.asObservable();
  

  public selectableScanners = [{'text':"None",id:0},{'text': "QAQC", id: 1},{'text': "Powders", id: 2},{'text': "Slipcasting", id: 3},{'text':"Furnaces",id:4}];
  public selectedScanner;
  
  
  private prefixNavigationMap = { 
    'QCID': '/material/container/QCID-',
    'QMSMLC': '/material/container/',
    'QMSML': '/material/lot/',
    'QMIM': '/material/',
	'QMIS': '/steel/',
  
  };
  
  public redirectOnScan: boolean = true;
  private selectedScanner: string;

  
  constructor(
	public router: Router, 
	private notification: NotificationsService,
	private settings: SettingsService,
	) {
		
		this.selectedScanner = settings.get('selectedScanner');
		
		}
  
  
	public toggleRedirectOnScan()
	{
		this.redirectOnScan = !this.redirectOnScan;
	}
	// For chat box
	public connect() {
	
	
				this.observable = Observable.create((observer) => {
				this.ws = new WebSocket(this.url);

				this.ws.onopen = (e) => {
					
					console.log('Websocket Connected',this.url);
				 
				};

				this.ws.onclose = (e) => {
				  if (e.wasClean) {
					observer.complete();
				  } else {
					observer.error(e);
				  }
				};

				this.ws.onerror = (e) => {
				  observer.error(e);
				}

				this.ws.onmessage = (e) => {
				//console.log(e);
					let r = JSON.parse(e.data);
				  observer.next(r);
				
				
					
				   try{  //Redirect user to specific screen based on scan event. 
						//console.log(r);
						let scannerResponse = r;
						if(scannerResponse.type == 'Scanner'){
							
						   console.log('Scanner Response',scannerResponse,this.redirectOnScan);
						  
						   this.notification.info('Scanner Event',scannerResponse.data,{timeOut:3000,showProgressBar:false,clickToClose: true});           
						   
						   if(this.redirectOnScan && scannerResponse.machine.name == this.selectedScanner.text) // is the app in rediect mode?
						   {					 
							  this.codeObj = this.parseScannerCode(scannerResponse.data);
							  let selectedRoute = this.prefixNavigationMap[this.codeObj.prefix];
							  this.router.navigate([selectedRoute+this.codeObj.id],{scannerNavigation:true}).catch(error => {
							  
								this.notification.error('Redirect Not Registered',scannerResponse.data,{timeOut:3000,showProgressBar:false,clickToClose: true});
							});				
								
						   }
						}
						  
					}catch(e){} 
				
				}

				return () => {
				  this.ws.close();
				};
			  }).pipe(share());
	
		// this.ws$..next(JSON.stringify({ op: 'hello' }));
			
		
			  
	  
	  
				/* */
			   //   console.log(res); 
		
		
	}

	
  parseScannerCode (code)
  {
    try{
        let explode = code.split("-");
        let r = {};
        r['prefix'] = explode[0];
        r['id'] = explode[1];
        return r;
    
    }
    catch(e){
    
    return false;
    
    }
  
  
  }
  


}
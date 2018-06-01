import { Injectable } from '@angular/core';
import {Observable, Subject, Observer,BehaviorSubject} from 'rxjs';
import { NotificationsService } from 'angular2-notifications';


import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socketUrl = 'ws://api.edm.quantiam.com:8081';
 
  private subject: Subject<MessageEvent>;
	private subjectData: Subject<number>;
  
  public _wsSource = new BehaviorSubject({});
  public ws$: Observable<any> = this._wsSource.asObservable();
  
  private prefixNavigationMap = { 
    'QCID': '/material/container/QCID-',
    'QMSMLC': '/material/container/',
    'QMSML': '/material/lot/',
    'QMIM': '/material/',
  
  };
  
  private redirectOnScan: boolean = true;

  
  constructor(public router: Router, private notification: NotificationsService) { }
  
	// For chat box
	public connect(): Subject<MessageEvent> {
		if (!this.subject) {
			this.subject = this.create(this.socketUrl).subscribe(
      res =>
      {
        this._wsSource.next(res);
      // console.log(resres.data.indexOf('"type": "Balance"'));
        
        try{
            if(res.data.indexOf('"type": "Scanner"') !== -1){
                
                let scannerResponse = JSON.parse(res.data);
               
               // console.log(codeObj);
               console.log('Scanner Response',scannerResponse);
                this.notification.info('Scanner Event',scannerResponse.data,{timeOut:3000,showProgressBar:false,clickToClose: true});
                              
               if(this.redirectOnScan)
               {
                   let codeObj = parseScannerCode(scannerResponse.data);
                  let selectedRoute = this.prefixNavigationMap[codeObj.prefix];
                  this.router.navigate([selectedRoute+codeObj.id]);                   
               }
            }
              
            //if(res..data.machine.type == 'scanner') console.log(res);
        }catch(e){}
       //   console.log(res);
      }
      
      );
		}
		return this.subject;
	}

	private create(url: string): Subject<MessageEvent> {
		let ws = new WebSocket(url);
  console.log(ws);
		let observable = Observable.create(
			(obs: Observer<MessageEvent>) => {
				ws.onmessage = obs.next.bind(obs);
				ws.onerror   = obs.error.bind(obs);
				ws.onclose   = obs.complete.bind(obs);

				return ws.close.bind(ws);
			});
      
      return observable;

		let observer = {
			next: (data: Object) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			}
		};

		return Subject.create(observer, observable);
	}

  
  sendMessage (msg)
  {
 //  this.subjectData
  
  }
  
  function parseScannerCode (code)
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
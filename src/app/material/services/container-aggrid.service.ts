import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay,shareReplay, publishReplay,refCount } from 'rxjs/operators';
import { Observable,of, BehaviorSubject,throwError } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ContainerAggridService {

  private endpoint = '/material/lot/container';
  private modelName = 'Container';

  public _DatabaseSource = new BehaviorSubject({});
  public Database$: Observable<any> = this._DatabaseSource.asObservable();
  
  private last_params: string;  
  private lastDbParams: any;  
  private alreadyLoadedDb:boolean = false;
   


  constructor(
		public http: HttpClient, 
		public notification: NotificationsService,) { }

  
  getDatabase(params:Object){
	  
	  
		if(!this.alreadyLoadedDb)
		{
			
			this.alreadyLoadedDb = true;
		  
		   return  this.http.get<any>(environment.apiUrl+`${this.endpoint}?filterSpinner&creator=true`,params)
			   .pipe( 
					map( res => {  
             // this.notification.success('Delete','Sample Deleted',{showProgressBar:false,timeOut:3000,clickToClose: true});        
					  return res; 			
					})
				)
			  .subscribe(
			  	(r:any) => {
					this._DatabaseSource.next(r); //broadcast the material to all subscribers 					
				}
			  );
	  
		}  
	}
  



}

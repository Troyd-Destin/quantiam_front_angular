

import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay,shareReplay, publishReplay,refCount } from 'rxjs/operators';
import { Observable,of, BehaviorSubject,throwError } from 'rxjs'
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})


export class MaterialLotContainerService {

  public _containerSource = new BehaviorSubject({});
  public materialLotContainer$: Observable<any> = this._containerSource.asObservable();
  
  private last_id: string;  
  private endpoint = '/material/lot/container';

  constructor(public http: HttpClient, public notification: NotificationsService) { }
  
    
  getMaterialLotContainer(id :string)
  {
   //  console.log(id,this.last_id);
    if(id != this.last_id) // fetch if id is different
    {
      
     this.http.get<any>(environment.apiUrl+`${this.endpoint}/${id}`)
     .pipe(
        tap( r => { 
                    this.last_id = id;
                    
                    }), //set id to be last_id
        map( res => res), // return results without transformation
      
      )
      .subscribe(
        (container) => this._containerSource.next(container) //broadcast the material to all subscribers       
      );
    }
  }
  
  
  update(params, id = null)
  {
	if(!id)  id = this.last_id;    
	
	//if(params.active) params.active = params.active ? 1 : 0;
	
     console.log(params);
    return  this.http.put<any>(environment.apiUrl+`${this.endpoint}/${id}?filterSpinner`, params)
     .pipe(
        tap( r => {
			
			}), 
        map( res => {
		
			if(res.lot) this._containerSource.next(res);
			this.notification.success('Updated','Container updated.',{showProgressBar:false,timeOut:3000,clickToClose: true});
			
			return res; 
			
		})
	);
  
  }
  
  
  
  create(params)
  {
  
	return this.http.post<any>(environment.apiUrl+`${this.endpoint}?filterSpinner`, params)
     .pipe(
        tap( r => {}), 
        map( res => { 
			
			 this.notification.success('Container','Created container '+res.id,{showProgressBar:false,timeOut:3000,clickToClose: true});
 
			return res
			}), // return results without transformation
         //catchError( (e) => this.notification.error('Error','Problem updating material.',{showProgressBar:false,timeOut:3000,clickToClose: true})),
       
      );
  }
}
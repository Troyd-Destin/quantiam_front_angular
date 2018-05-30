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


export class MaterialService {

  public _materialSource = new BehaviorSubject({});
  public material$: Observable<any> = this._materialSource.asObservable();
  
  private last_id: number;  
  private endpoint = '/material';

  constructor(public http: HttpClient, public notification: NotificationsService) { }
  
    
  getMaterial(id :number)
  {
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
        (material) => this._materialSource.next(material) //broadcast the material to all subscribers       
      );
    }
  }
  
  updateMaterial(params)
  {
     let id = this.last_id;    
     
     this.http.put<any>(environment.apiUrl+`${this.endpoint}/${id}?filterSpinner`, params)
     .pipe(
        tap( r => {}), 
        map( res => res), // return results without transformation
         //catchError( (e) => this.notification.error('Error','Problem updating material.',{showProgressBar:false,timeOut:3000,clickToClose: true})),
       
      )
      .subscribe(
        (material) => 
        {
        //  this._materialSource.next(material); //broadcast the material to all subscribers 
          this.notification.success('Updated','material updated',{showProgressBar:false,timeOut:3000,clickToClose: true});
        }
      );
  
  }
 
  
  
  
  
}
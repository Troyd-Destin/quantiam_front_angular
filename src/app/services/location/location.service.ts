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
export class LocationService {

  public _Source = new BehaviorSubject({});
  public obj$: Observable<any> = this._Source.asObservable();
  
  private last_id: number;  
  private endpoint = '/location';

  constructor(public http: HttpClient, public notification: NotificationsService) { }
  
  getList(params, id = null)
  {
    
  
  
  }
  
  
}



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
     console.log(id,this.last_id);
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
  
  
  updateMaterialLotContainer()
  {
  
  
  
  }
  
}
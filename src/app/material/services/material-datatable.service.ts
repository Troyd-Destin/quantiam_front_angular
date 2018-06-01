
import { MaterialModule} from '../material.module';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay,shareReplay, publishReplay,refCount } from 'rxjs/operators';
import { Observable,of, BehaviorSubject,throwError } from 'rxjs'
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'MaterialModule'
})
export class MaterialDatatableService {

    public _materialDatatableSource = new BehaviorSubject({});
    public materialDatatable$: Observable<any> = this._materialDatatableSource.asObservable();
  
    private last_params: string;  
    private endpoint = '/material/list/datatables';


    constructor(public http: HttpClient, public notification: NotificationsService) { }
    
    
    
    getMaterialDatatable(params){
    
          let new_string = JSON.stringify(params);
    
    
          if(new_string != this.last_params) // fetch if id is different
          {
            
           this.http.post<any>(environment.apiUrl+`${this.endpoint}`,params)
           .pipe(
              tap( r => { 
                          this.last_params = new_string;
                          
                          }), //set id to be last_id
              map( res => res), // return results without transformation
            
            )
            .subscribe(
              (r) => this.materialDatatable.next(r) //broadcast the response to all subscribers       
            );
          }
        
  
    }
    
}

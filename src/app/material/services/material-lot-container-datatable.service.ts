import { MaterialModule} from '../material.module';
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
export class MaterialLotContainerDatatableService {

    public _materialLotContainerDatatableSource = new BehaviorSubject({});
    public materialLotContainerDatatable$: Observable<any> = this._materialLotContainerDatatableSource.asObservable();
  
    private last_params: string;  
    private endpoint = '/material/lot/container/list/datatable';
	//private forceRefresh = false;


    constructor(public http: HttpClient, public notification: NotificationsService) { }
    
    serialize = function(obj, prefix) {
      var str = [],
        p;
      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
          str.push((v !== null && typeof v === "object") ?
            this.serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }
      return str.join("&");
    }

    getMaterialLotContainerDatatable(params,forceRefresh){
      
			
          let defaultRequest = false;
          if(params.draw == 1) defaultRequest = true;  //identify if it is teh default request
          params.active = 1;
		  
		
		  
          let new_string = params;          
          delete new_string.draw; //drwa increments, for every request, complicates caching purposes.
          new_string = JSON.stringify(params);
         
        
          if(forceRefresh || (((new_string != this.last_params) && !defaultRequest) || (!this.last_params && defaultRequest))) // fetch if things are different.
          { 
              
           this.http.post<any>(environment.apiUrl+`${this.endpoint}`,this.serialize(params,null),  {
                          headers: new HttpHeaders()
                            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
                        })
           .pipe(
              tap( r => { 
                          this.last_params = new_string;
                          
                          }), //set id to be last_id
              map( res => res), // return results without transformation
            
            )
            .subscribe(
              (r) => this._materialLotContainerDatatableSource.next(r) //broadcast the response to all subscribers       
            );
          }
        
  
    }
    
    
    
}

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
export class MaterialSupplierService {


  public _materialLotContainerDatatableSource = new BehaviorSubject({});
  public materialLotContainerDatatable$: Observable<any> = this._materialLotContainerDatatableSource.asObservable();

  constructor() { }
  
  
  getList()
  {
  
  
  
  }
  
}

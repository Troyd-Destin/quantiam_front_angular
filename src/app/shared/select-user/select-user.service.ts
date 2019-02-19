import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { catchError, map, tap,  } from 'rxjs/operators';
import { Observable,  BehaviorSubject,  } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class SelectUserService {

  private endpoint = '/users';
  private modelName = 'User';

  private listFetched = false;
  private previousParams = {};

  public _UserListSource = new BehaviorSubject({});
  public list$: Observable<any> = this._UserListSource.asObservable();



 constructor(public http: HttpClient, public notification: NotificationsService) { }

 list(params = {}) {

       if (!this.listFetched || this.previousParams !== params) {

          this.previousParams = params;
          this.http.get<any>(environment.apiUrl + `${this.endpoint}`, params)
          .pipe(
             tap( r => {    }), // set id to be last_id
             map( r =>  r), // return results without transformation
             catchError((err) => {
                this.notification.error('Error', 'Does not exist.', {showProgressBar: false, timeOut: 3000, clickToClose: true});
                return err;
              }),
           )
           .subscribe(
             (r: any) => {
               this.listFetched = true;
               if (r) { this._UserListSource.next(r); } // broadcast the material to all subscribers

         }
           );

       }
 }

 listMachines()
 {



 }
}

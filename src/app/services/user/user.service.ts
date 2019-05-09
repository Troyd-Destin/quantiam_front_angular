import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay, shareReplay, publishReplay, refCount } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
 //
interface authedUser$ {}

@Injectable({providedIn: 'root', })
export class UserService  {

  endpoint = '/user';
  authedUser$;
  currentUser;


  public _selectedUserSource = new BehaviorSubject({});
  public user$: Observable<any> = this._selectedUserSource.asObservable();

  private last_id: string;


  constructor(public router: Router, public jwtHelper: JwtHelperService, public http: HttpClient, public notification: NotificationsService) {




  }



  getUser(id: string) {
   //  console.log(id,this.last_id);
    if (id !== this.last_id) {

     this.http.get<any>(environment.apiUrl + `${this.endpoint}/${id}`)
     .pipe(
        tap( r => {


                    }), // set id to be last_id
        map( res => res), // return results without transformation

      )
      .subscribe(
        (container) => {
			this._selectedUserSource.next(container); // broadcast the material to all subscribers
			 this.last_id = container.id;
		}
      );
    }
  }

  changeSupervisor(userId, supervisorId) {


    const params = {
      'employeeID': userId,
      'newSupervisorID': supervisorId,
     };


    return this.http.post<any>(environment.apiUrl + `${this.endpoint}/move`, params)
    .pipe(
         map( (r) => {

          this.notification.success('Updated', 'User supervisor changed.', {showProgressBar: false, timeOut: 3000, clickToClose: true});
          return r;
         }), // return results without transformation
     );

  }

  deletePermission(id) {

   return this.http.delete<authedUser$>(environment.apiUrl + `${this.endpoint}/permission/${id}`).pipe(
			tap( r => {

				}),
			map( res => {


				this.notification.success('Updated', 'Was successful.', {showProgressBar: false, timeOut: 3000, clickToClose: true});

				return res;

				})
			);


  }

  deleteRfid(id) {
	   return this.http.delete<authedUser$>(environment.apiUrl + `${this.endpoint}/rfid/${id}`).pipe(
			tap( r => {

				}),
			map( res => {


				this.notification.success('Updated', 'We updated the user for you.', {showProgressBar: false, timeOut: 3000, clickToClose: true});

				return res;

			})
		);

 }

  updateRtoAllotment(id, obj) {
    return this.http.put<any>(environment.apiUrl + `/rto/allocation/${id}` + '?filterSpinner', obj).pipe(
      tap( r => {

        }),
      map( res => {


         this.notification.success('Updated', 'We changed that for you.', {showProgressBar: false, timeOut: 3000, clickToClose: true});

        return res;

      })
    );

  }

 public update(id, obj) {

   return this.http.put<any>(environment.apiUrl + `${this.endpoint}/${id}`, obj).pipe(
     tap( r => {

       }),
     map( res => {


        this.notification.success('Updated', 'We updated the user for you.', {showProgressBar: false, timeOut: 3000, clickToClose: true});

       return res;

     })
   );

 }


  public getAuthedUser(id = null) {

     if (localStorage.getItem('authUser') === null) {  }


     if (this.authedUser$) {
        return this.authedUser$;
     }




     const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));

     try {


      if(!id){ id = token.employeeID; }
 
    return this.http.get<authedUser$>(environment.apiUrl + `${this.endpoint}/${id}`).pipe(
      //  delay(1000), // simulate slow network
        tap(
          x => {
            console.log(`fetched user ${id}`, x);
            localStorage.setItem('authedUser', JSON.stringify(x));
          }
         ),
        );

      } catch (e) {
        this.notification.error('Error', 'You aren\'t logged in!', {timeOut: 4000, clickToClose: true});
        this.router.navigate(['auth']);

      }
  }

  public fetchAuthUserObj () {
       this.currentUser = JSON.parse(localStorage.getItem('authedUser'));
      return this.currentUser;
  }

  public hasPermission(permission_id) {

     // console.log(this.authedUser$);
      let checked = false;
      let Exception = {};
      const user = this.fetchAuthUserObj();

      if(Array.isArray(permission_id))
      {
       
        try{
        permission_id.forEach((p, index) => {

          let result = user.permissions.filter(obj => {
            return obj.permission_id === p;
          })

         // console.log(result);

          if(result[0]){
            checked = true;
             throw Exception;
            }

        })
      } catch(e){  }

        if(checked){ return true; }

      }
      else
      {      // console.log(user.permissions);

      for (let i = 0; i < user.permissions.length; i++) {
      // console.log(user.permissions[i]);
            if (user.permissions[i].permission_id === permission_id) { return true; }
        }
      }

      return false;

  }

  public hasSubordinates()
  {
    const user = this.fetchAuthUserObj();
    if( user.subordinates[0]) { return true; }
    return false;
  }

  public hasMachines()
  {
    const user = this.fetchAuthUserObj();
    if( user.machines[0]) { return true; }
    return false;
  }

  public hasSupervsors()
  {

    const user = this.fetchAuthUserObj();
    if( user.supervisors[0]) { return true; }
    return false;
  }
  

}

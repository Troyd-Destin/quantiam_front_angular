import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Observable,of, } from 'rxjs';

@Injectable({providedIn: 'root',})
export class UserService  {
  
  endpoint = '/user';
  authedUser = null;
 // requestedUser = Observable<any>;
  
  constructor(public jwtHelper: JwtHelperService,public http: HttpClient, ) { }
  
  /* getUser(){
      
     
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));      
      let params = {};
      return this.http.get(environment.apiUrl+'/user/'+token.employeeID,params);
  
  } */
  
  public getAuthedUser() {
  
     if(this.authedUser) // If no specific user is asked for, provide the logged in user. 
     {
        return Observable.of(this.authedUser);
     }
     
     const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
     let id = token.employeeID;
         
    return this.http.get<any>(environment.apiUrl+`${this.endpoint}/${id}`).pipe(
        delay(1000), // simulate slow network
        tap(
          x => {
            console.log(`fetched user ${id}`, x)
            this.authedUser = x;
          }
         ),
        );
  }
  
  
}

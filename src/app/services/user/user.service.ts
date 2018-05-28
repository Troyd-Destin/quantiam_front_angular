import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Observable,of,fromEvent } from 'rxjs';

 //
interface authedUser$ {}
 
@Injectable({providedIn: 'root',})
export class UserService  {
  
  endpoint = '/user';
 // const authedUser$ = Observable.create(of(JSON.parse(localStorage.getItem('authedUser'))));
	//authedUser$ =
	authedUser$;
	
  constructor(public jwtHelper: JwtHelperService,public http: HttpClient, ) { 
    
  
    
    
    }
  
  /* getUser(){
      
     
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));      
      let params = {};
      return this.http.get(environment.apiUrl+'/user/'+token.employeeID,params);
  
  } */
  
  public getAuthedUser() {
  
     if(localStorage.getItem('authUser') === null){
     
        //return Observable.create(of(JSON.parse(localStorage.getItem('authedUser')))); //somehow need to turn this into a subcribable observable
        
     }
  
  
     if(this.authedUser$) // If no specific user is asked for, provide the logged in user. 
     {
        return this.authedUser$;
     }
  
  
     
     
     const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
     let id = token.employeeID;
         
    return this.http.get<authedUser$>(environment.apiUrl+`${this.endpoint}/${id}`).pipe(
      //  delay(1000), // simulate slow network
        tap(
          x => {
            console.log(`fetched user ${id}`, x);
            localStorage.setItem('authedUser',JSON.stringify(x));
          }
         ),
        );
  }
  
  public fetchAuthUserObj ()
  {
      return JSON.parse(localStorage.getItem('authedUser'));
  }
  
  public checkPermission(permission_id){
  
     // console.log(this.authedUser$);
      let user = this.fetchAuthUserObj();
      //console.log(user.permissions);
      
      for(var i=0; i < user.permissions.length; i++){
      // console.log(user.permissions[i]);
            if(user.permissions[i].permission_id == permission_id) return true;
        }
      
      return false;
  
  }
  
  
}

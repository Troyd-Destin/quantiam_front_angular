import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable,of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationsService } from 'angular2-notifications';


import { UserService } from '../user/user.service';

interface Authentication {
	
	token: string;
	
}

@Injectable({providedIn: 'root',})
export class AuthService {
//
  constructor( 
    public router: Router,
    public http: HttpClient, 
    public jwtHelper: JwtHelperService, 
    public user: UserService, 
    public notification: NotificationsService,
   ) { }
  
  login(username,pass)
  { 
   
      var params = {username: username, pass: pass};
      console.log(params);
      return this.http.post<Authentication>(environment.apiUrl+'/auth',params).subscribe(
      
          response => {
            console.log(response);
            if(response.token)
			{
				localStorage.setItem('token',response.token);                      
				this.router.navigate(['']);
			}
            //this.notification.success('Authenticated','Seems good.',{timeOut:3000,showProgressBar:true,clickToClose: true});
          },
          error => {
            this.notification.error('Error','Authentication Failure',{timeOut:4000,showProgressBar:true,clickToClose: true});
            console.log('there was an error');
          },
      );
  
  }
  
  isLoggedIn()
  {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false  console.log(this.jwtHelper.isTokenExpired(token));
   
    return !this.jwtHelper.isTokenExpired(token);
  }
  
  logout()
  {
    localStorage.removeItem('token');
    this.router.navigate(['auth']);
  }

  
  
}

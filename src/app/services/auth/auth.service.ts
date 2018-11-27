import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
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
    private route: ActivatedRoute
   ) { }
  
  
  token_auth(token){
  
				localStorage.setItem('token',token);
                
              if(sessionStorage.getItem("redirectAuthPreviousRouteUrl") === null){ this.router.navigate(['']) } 
              else { 
              
                this.router.navigate([sessionStorage.getItem('redirectAuthPreviousRouteUrl')]); 
                sessionStorage.removeItem('redirectAuthPreviousRouteUrl');
                }
  
  }
  
  login(username,pass,rfid)
  { 
   
      var params = {username: username, pass: pass, rfid: rfid};
      console.log(params);
      return this.http.post<Authentication>(environment.apiUrl+'/auth',params).subscribe(
      
          response => {
            console.log(response);
            if(response.token)
              {
               
               this.token_auth(response.token); 
               
              }
            //this.notification.success('Authenticated','Seems good.',{timeOut:3000,showProgressBar:true,clickToClose: true});
          },
          error => {
            this.notification.error('Error','Authentication Failure',{timeOut:4000,showProgressBar:true,clickToClose: true});
            console.log('there was an error');
          },
      );
  
  }
  
  isLoggedIn(token = null)
  {
   
    if(!token || token.length == 0) token = localStorage.getItem('token');  

    try{

    return !this.jwtHelper.isTokenExpired(token);
    }
    catch(e){ return false;}
  }
  
  logout()
  {
    localStorage.removeItem('token');
    this.router.navigate(['auth']);
  }

  
  
}

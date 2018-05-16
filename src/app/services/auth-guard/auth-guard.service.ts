import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad{

  constructor(public auth: AuthService,private router: Router) { }
   canLoad(route: Route): boolean {
   
      if(this.auth.isLoggedIn())
      {
       
        return true;
      }
      else { 
       
        this.router.navigate(['auth']);
        
      }
    	return false;
  }
}
//
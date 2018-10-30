// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {catchError} from "rxjs/internal/operators";


import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from './../services/auth/auth.service';
import { Observable, of } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  constructor(public auth: AuthService,private router: Router) {}
  
  
  
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    console.log(request);
    
    if(request.url.includes(environment.apiUrl)) // only apply our token to Quantiam Api requests.
    {
    
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer '+localStorage.getItem('token'),
        }
      });
    }
    
    return next.handle(request).pipe(catchError((error, caught) => {
      //intercept the respons error and displace it to the console
      console.log(error);
      this.handleAuthError(error);
      return of(error);
    }) as any);
  
  
  }


  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401) {
      //navigate /delete cookies or whatever
      console.log('handled error ' + err.status);
      this.router.navigate(['/auth']);
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message);
    }
    throw err;
  }
}
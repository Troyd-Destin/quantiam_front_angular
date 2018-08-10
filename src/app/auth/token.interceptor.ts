// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


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
  
  constructor(public auth: AuthService) {}
  
  
  
  
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
    
    return next.handle(request);
  
  
  }
}
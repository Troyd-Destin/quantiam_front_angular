// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
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
    
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer '+localStorage.getItem('token'),
      }
    });
    
    
    return next.handle(request);
  
  
  }
}
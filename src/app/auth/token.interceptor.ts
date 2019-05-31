// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators';
import { NotificationsService } from 'angular2-notifications';

import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
    HttpParams,
    HttpHeaders,
} from '@angular/common/http';
import { AuthService } from './../services/auth/auth.service';
import { Observable, of } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService, private router: Router,
        public notification: NotificationsService, ) {}




    intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {


        if (request.url.includes(environment.apiUrl)) {

            const newParams: any = {};

            request.params.keys().forEach((key) => {
                if (request.params.get(key) == null) {} else {
                    newParams[key] = request.params.get(key);
                }
            });
           // console.log(newParams, request.params.keys());
            const params = new HttpParams({fromObject : newParams});
        
          //  console.log(params);
            const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('token'), });

            request = request.clone({ headers, params });



        }

      //  console.log(request);
        return next.handle(request).pipe(catchError((error, caught) => {
            // intercept the respons error and displace it to the console
            console.log(error);
            this.handleAuthError(error);
            return of(error);
        }) as any);


    }


    private handleAuthError(err: HttpErrorResponse): Observable < any > {
        // handle your auth error or rethrow
        if (err.status === 401 && this.router.url !== '/auth') {
            // navigate /delete cookies or whatever

            this.notification.error('Unauthorized', 'Your session has expired.', { timeOut: 4000, showProgressBar: false, clickToClose: true });
            console.log('handled error ' + err.status);
            this.router.navigate(['/auth']);
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            // return of(err.message);
            // throw err;
        }
        throw err;
    }
}
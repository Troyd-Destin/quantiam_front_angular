import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay,shareReplay, publishReplay,refCount } from 'rxjs/operators';
import { Observable,of, BehaviorSubject,throwError } from 'rxjs'
import { NotificationsService } from 'angular2-notifications';
 //
interface authedUser$ {}
 
@Injectable({providedIn: 'root',})
export class UserService  {
  
  endpoint = '/user';
  authedUser$;
 
	
  public _selectedUserSource = new BehaviorSubject({});
  public user$: Observable<any> = this._selectedUserSource.asObservable();
  
  private last_id: string; 


  constructor(public jwtHelper: JwtHelperService,public http: HttpClient, public notification: NotificationsService ) { 
    
  
    
    
    }
	
	
	    
  getUser(id :string)
  {
   //  console.log(id,this.last_id);
    if(id != this.last_id) // fetch if id is different
    {
      
     this.http.get<any>(environment.apiUrl+`${this.endpoint}/${id}`)
     .pipe(
        tap( r => { 
                   
                    
                    }), //set id to be last_id
        map( res => res), // return results without transformation
      
      )
      .subscribe(
        (container) => {
			this._selectedUserSource.next(container); //broadcast the material to all subscribers 
			 this.last_id = container.id;
		}
      );
    }
  }
  
  deletePermission(id)
  {
  
   return this.http.delete<authedUser$>(environment.apiUrl+`${this.endpoint}/permission/${id}`).pipe(
			tap( r => {
				
				}), 
			map( res => {
			
			
				this.notification.success('Updated','Was successful.',{showProgressBar:false,timeOut:3000,clickToClose: true});
				
				return res; 
				
			})
		);
  
  
  }
  
  deleteRfid(id){
	   return this.http.delete<authedUser$>(environment.apiUrl+`${this.endpoint}/rfid/${id}`).pipe(
			tap( r => {
				
				}), 
			map( res => {
			
			
				this.notification.success('Updated','We updated the user for you.',{showProgressBar:false,timeOut:3000,clickToClose: true});
				
				return res; 
				
			})
		);
	  
 }
  
  

  
  public getAuthedUser() {
  
     if(localStorage.getItem('authUser') === null){
     
       
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
  
  public hasPermission(permission_id){
  
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

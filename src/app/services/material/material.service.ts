import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Observable,of, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  endpoint = '/material';
  material = new Subject<any>();
  
  //Material$;

  constructor(public http: HttpClient) { }
  
    
  public get(id = null) {
  
    let storedMaterial = JSON.parse(localStorage.getItem('material')) || null; 
    
    console.log(storedMaterial);
    
    if(storedMaterial.id == id || !id)
    {
     
      this.material.next(storedMaterial);
    }
    else
    {    
   
     this.http.get(environment.apiUrl+`${this.endpoint}/${id}`).subscribe(
      //  delay(1000), // simulate slow network
       
          x => {
            console.log(`Fetched Material ${id}`, x);
            localStorage.setItem('material',JSON.stringify(x));
            this.material.next(x);
          }
        
        );
    }   
    
    return this.material.asObservable();
  }
  
  public update (){
  
  
  }
  
  public delete(){
  
  
  }
  
  
  
  
}
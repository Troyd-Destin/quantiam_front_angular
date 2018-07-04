
import { Component } from '@angular/core';
import {  Route, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
   
})
export class AppComponent {

	constructor(router: Router)
  {
    
    router.events    
    .subscribe((e:any) => {    
  
      if(e.hasOwnProperty('url'))
      {
       if(sessionStorage.getItem("redirectAuthPreviousRouteUrl") === null && e.url != '/auth' && typeof e.url !== 'undefined') 
       {  
          sessionStorage.setItem('redirectAuthPreviousRouteUrl',e.url);
       }
      }
     
     
    // if (e instanceof ResolveStart) sessionStorage.setItem('redirectAuthPreviousRouteUrl',e.url);

    });
  }
}

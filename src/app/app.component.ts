
import { Component } from '@angular/core';
import {  Route, Router } from '@angular/router';
import { fadeAnimation } from './animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation] // register the animation
   
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

    });
  }
}

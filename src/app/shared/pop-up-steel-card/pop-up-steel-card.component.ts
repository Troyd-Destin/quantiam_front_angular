import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';


import { Router } from '@angular/router';

import { PopUpSteelCardServiceService } from './pop-up-steel-card-service.service';

@Component({
  selector: 'app-pop-up-steel-card',
  templateUrl: './pop-up-steel-card.component.html',
  styleUrls: ['./pop-up-steel-card.component.css'],
  host: {
    '(document:mousemove)': 'onMouseMove($event)',
    '(document:keydown)' : 'onKeydown($event)',
    '(document:keyup)' : 'onKeyup($event)',
  }
})
export class PopUpSteelCardComponent implements OnInit {

  visible = false;
  keepPopUpStill = false;
  hideAfterRelease = false;

  steelObj; 

  styleObj = {
    left: '200px',
    top: '100px'
  }
 

  constructor( private service: PopUpSteelCardServiceService,private router:Router,) { }

  ngOnInit(){

    this.service.change.subscribe(steelObj => {
     
     
         if(steelObj.hasOwnProperty('id'))
         {
            this.visible = true;
            this.steelObj = steelObj;
            return;
           
         }
         
         if(this.keepPopUpStill) {
            
            this.hideAfterRelease = true;
            return;
         }
        
          this.visible = false;
         


    });

  }

  onMouseMove(e) {
 //   console.log(e);
    if(this.visible && !this.keepPopUpStill)
    {
        this.styleObj = {
          left: (e.clientX+30)+'px',
          top: e.clientY+'px'
        };
    }
  }

  onKeydown(e)
  {
    if(e.ctrlKey){ this.keepPopUpStill = true;}
  }

  onKeyup(e)
  {
    if(!e.ctrlKey){ this.keepPopUpStill = false;}
    if(this.hideAfterRelease){ this.visible = false; this.hideAfterRelease = false; }
  }

  goToSteel()
  {
    this.visible = false;
    this.router.navigate(['/steel/' + this.steelObj.id]);

  }

 
}

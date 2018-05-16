
import { Component,ChangeDetectorRef,OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
   providers: [
      MediaMatcher,
      UserService,
   
  ],
})
export class CoreComponent implements OnInit {

  


  title = 'app';
  user: {};
  userLoaded: boolean = false;
  userTitle: null;
  userName: null;
	options: FormGroup;	
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;	
	

  constructor(fb: FormBuilder,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private userService: UserService, private auth: AuthService) {
    
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    
      this.options = fb.group({
        'fixed': false,
        'top': 0,
        'bottom': 0,
      });
      
     // get user data and store in user Variable
     this.userService.getAuthedUser().subscribe( res => { 
       console.log('worked'); 
       this.userTitle = res.title; 
       this.userName = res.name; 
       this.userLoaded = true;
       
       });
      
      //this.user.getUser
  }
  
  logout()
  {
      this.auth.logout();
  
  }
  
  
  
  
  ngOnInit() {
    
    //
    
  }
  
   ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  
}

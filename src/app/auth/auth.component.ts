import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { SgxScaleWebsocketService } from '../services/sgx-scale-websocket/sgx-scale-websocket.service'; 

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  providers:[AuthService],
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

   hidePassword = true;
   ws:any;
   _ws:any;

  constructor(private auth: AuthService, private scale_websocket: SgxScaleWebsocketService) { }

  ngOnInit() {
	  
	  try{ this.ws = this.scale_websocket.connect(); }catch(e) {}
	  
	
	  if(this.ws) this._ws.subscribe((x)=>{
		  
		  
				console.log(x);
				//if token  login(null,null, rfid);
		  
		  })
  }
  
  login(username,password,rfid)
  {
    //console.log(username,password);
    this.auth.login(username,password,null);
  }
  
  
  ngOnDestroy()
  {
     if(this._ws) this._ws.unsubscribe(); 
  }
  

}

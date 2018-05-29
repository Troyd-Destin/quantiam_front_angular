import { Component, OnInit } from '@angular/core';


import { UserService } from '../../services/user/user.service';
import { SgxScaleWebsocketService } from '../../services/sgx-scale-websocket/sgx-scale-websocket.service'; 

@Component({
  selector: 'app-sgx-scale-auth',
  templateUrl: './sgx-scale-auth.component.html',
  styleUrls: ['./sgx-scale-auth.component.css'],
   providers: [SgxScaleWebsocketService,UserService,],
})
export class SgxScaleAuthComponent implements OnInit {

  scaleInfo;
  ws;
  locked = true;
  permissionTest = false;
  scaleInfoTest = false;

  constructor(  
  scale_websocket: SgxScaleWebsocketService,
  user: UserService,
  ) { 
  
    this.permissionTest = user.checkPermission(38);
    
    //console.log(permissionTest);
    
    if(this.permissionTest) this.ws = scale_websocket.connect();
   
    console.log(this.ws);
   
   /*  
   
   
   */
    
    
    }

  ngOnInit() {
    
    this.subscribeToScale();
   
    
  }
  
  subscribeToScale(){
  this.ws.subscribe(res=>{
     
          // if(res.event == 'status') this.scaleInfo = res;
      
           console.log(res.data);
          this.scaleInfoTest = true;
          
          
          
         try{
          this.scaleInfo = JSON.parse(res.data);
          
         
          //console.log(this.scaleInfo );
         } catch(e) {}
          //console.log(this.ws);
         
         });
  
  }
  
  public lockScale(){
  
    let payload = {
      "purpose":"balance_command",
      "string":"D \"Locked\""
      };
    
    this.locked = true;
    
    this.ws.next(payload);    
    
    
         payload = {
      "purpose":"balance_command",
      "string":"K 3"
      };
    
  
    
    this.ws.next(payload);    
    
  }
  
  public unlockScale(){
    
    
    let payload = {
      "purpose":"balance_command",
      "string":"DW"
      };
    
    this.locked = false;
    this.ws.next(payload); 
      
    
    
       payload = {
      "purpose":"balance_command",
      "string":"K 1"
      };
   this.ws.next(payload); 
    
   }
   
   
   
  

}

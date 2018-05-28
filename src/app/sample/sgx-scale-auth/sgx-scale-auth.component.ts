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
    
    if(this.permissionTest) this.ws = scale_websocket.connect().subscribe(res=>{
     
          // if(res.event == 'status') this.scaleInfo = res;
      
          // console.log(res);
          this.scaleInfoTest = true;
         try{
         
          if(res.machine.name == '') this.scaleInfo = res;
         } catch(e) {}
          //console.log(this.ws);
         
         });
    
    
    }

  ngOnInit() {
    
    
   
    
  }
  
  
  public lockScale(){
  
    let payload = {
      "purpose":"balance_command",
      "string":"D \"Locked\""
      };
    
    locked = true;
    
    this.ws.destination.next(payload);    
  }
  
  public unlockScale(){
    
       
    let payload = {
      "purpose":"balance_command",
      "string":"DW"
      };
    
    locked = false;
  
    this.ws.destination.next(payload);
      
    
   }
   
   
   
  

}

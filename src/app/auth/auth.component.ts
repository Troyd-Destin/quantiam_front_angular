import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  providers:[AuthService],
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

   hidePassword = true;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  
  login(username,password)
  {
    //console.log(username,password);
    this.auth.login(username,password);
  }

}

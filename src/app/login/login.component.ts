import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alertservice/alert-service.service';
import { AuthService } from '../services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showLoader = false;
  username = null;
  password= null;
 

  constructor(private authservice:AuthService,private alertService: AlertService) { }

  ngOnInit(): void {
  }

  login(){
    let x = this.username;
    let y = this.password;
    this.showLoader = true;
    if(this.username != null && this.password != null){
      this.showLoader = true;
      this.authservice.loginWithKeycloak(x,y);

      if(this.authservice.isLoggedin){
        this.showLoader = false;
      }
    }else{
      this.showLoader = false;
      this.alertService.success("please enter correct credentials")
    }    
  }

  forgotPass(){
    this.alertService.warning("Something went wrong! Please try later.")
  }

}

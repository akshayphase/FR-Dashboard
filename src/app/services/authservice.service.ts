import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from './alertservice/alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  dummyauth={
    username: "IVISUSA",
    password: 'ivisusa@123'
  }
  data: any;
  isLoggedin = new BehaviorSubject<Boolean>(false);
  loginurl ='http://smstaging.iviscloud.net:8080/auth/realms/IVISUSA/protocol/openid-connect/token';
  logina ='http://smstaging.iviscloud.net:8090/businessInterface/login/user'


 
  constructor(private router:Router, private alertService: AlertService, private http: HttpClient) { }

  getAuthStatus() {
    if(this.isLoggedin.value == true){
      return true
    }else{
      return false
    }
  }
  login(data:any) {
    if(this.dummyauth.username == data.username && this.dummyauth.password == data.password){
      this.isLoggedin.next(true)
      var x = JSON.stringify(data)
      localStorage.setItem('sessionUser', x);
      this.router.navigateByUrl('/gaurd')
    }else{
      this.alertService.warning("Please enetr correct credentials")
    }
  }

  logout() {
    this.isLoggedin.next(false);
    localStorage.clear()
  }



  loginWithKeycloak(username: any, password: any) {
    let url = `${this.logina}`;
    let headers = new HttpHeaders()   
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = {headers:headers};
    let data =new  HttpParams()
    .set('grant_type', 'password')
    .set('client_id', 'mobile')
    .set('client_secret', '435dc6d2-3746-4d32-a922-f73676e7ad2e')
    .set('username',username)
    .set('password',password)
    .set('realm','IVISUSA')

    
    this.http.post(url,data,options).subscribe((res:any)=>{
      if(res.access_token){
        this.isLoggedin.next(true);
        var x = JSON.stringify(res);
       // localStorage.setItem('sessionUser', x);
        this.router.navigateByUrl('/gaurd');
      }else{
        this.alertService.warning("Please enter correct credentials");
      }
    },
    (error)=> {
      console.error('Log error', error);
      this.alertService.warning("Something went wrong please try after some time ")
    })

  }


}

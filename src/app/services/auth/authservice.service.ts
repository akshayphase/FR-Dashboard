import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  data: any;
  isLoggedin = new BehaviorSubject<Boolean>(false);
  baseurl='http://smstaging.iviscloud.net:8090/';
  baseurl1="http://usmgmt.iviscloud.net:777/";
  refreshtokenurl = `${this.baseurl}businessInterface/login/refreshtoken`;
 
  constructor( 
    private http: HttpClient,
    private storageService: StorageService) { }


  loginWithKeycloak(username: any, password: any) {
    let loginurl  = "http://smstaging.iviscloud.net:8080/auth/realms/IVISUSA/protocol/openid-connect/token";
    let logina    = `${this.baseurl}businessInterface/login/user`;
    let url       = `${this.baseurl}keycloakApp/login`;
    let signinurl = `${this.baseurl}businessInterface/login/login`;
    let finalurl  = `${this.baseurl}businessInterface/login/login_2_0`;
    let data ={
      userName: username,
      password: password,
      calling_System_Detail: "portal"
    }
    return this.http.post(finalurl,data)
  }
  logout() {
    let url        = `${this.baseurl}keycloakApp/logout`;
    let signouturl = `${this.baseurl}businessInterface/login/logout`;
    let payload = {UserName : '',AccessToken : ''}
    var a = this.storageService.getEncrData('user')
    if(a){
    payload ={
      UserName : a.UserName,
      AccessToken : a.access_token
      }
    }
    localStorage.clear();
    this.storageService.deleteStoredEncrData('user');
    return this.http.post(signouturl,payload)
  }

  getAuthStatus() {
    var a = this.storageService.getEncrData('user');
    if (a == null) {
      return false;
    }else{
      return true;
    }
  }

  forgotPassword(username:string){
    let url = `${this.baseurl}businessInterface/login/resetPassword_1_0`;
    let payload ={
      userName: username,
      calling_System_Detail: "Mobile_App"
    }
    return this.http.post(url,payload)

  }


}

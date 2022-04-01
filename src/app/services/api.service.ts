import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './auth/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  error$ = new BehaviorSubject<any>('');
  baseurl='http://smstaging.iviscloud.net:8090/';
  baseurl1="http://usmgmt.iviscloud.net:777/";
  siteservices$ = new BehaviorSubject<any>('');
  sitelisturl = `${this.baseurl}businessInterface/sites/sitesList_2_0`;
  camlisturl = `${this.baseurl}businessInterface/Cameras/CameraStreamList_1_0`;
  refreshtokenurl = `${this.baseurl}businessInterface/login/refreshtoken`;
  servicesurl=`${this.baseurl}businessInterface/services/SiteServicesList_1_0`;
 
  constructor(
    private http: HttpClient, 
    private storageService:StorageService,
    private router : Router
    ){ }

  getSites(){
    var a = this.storageService.getEncrData('user');
    let payload ={
      userName : a.UserName,
      accessToken : a.access_token,
      calling_System_Detail: "portal",
    }
    return this.http.post(this.sitelisturl,payload)
  }
  getCameras(siteid: any){
    var a = this.storageService.getEncrData('user');
    let payload ={
      userName : a.UserName,
      accessToken : a.access_token,
      SiteId: siteid,
      calling_System_Detail: "portal",
    }
    return this.http.post(this.camlisturl,payload);
  }
  refresh(){
    var a = this.storageService.getEncrData('user');
    let payload={
      userName: a.UserName,
      calling_System_Detail: "portal",
      refreshToken:a.refresh_token
    }
    this.http.post(this.refreshtokenurl,payload).subscribe((res:any)=>{
      if(res.Status== 'Failed'){this.onHTTPerror({status:404})}
      if(res.Status == "Success"){
        this.storageService.storeEncrData('user', res);
      }
    },(error)=>{
      this.onHTTPerror(error);
    })
  }

  getServices(siteid:any){
    var Request_type = "Services";
    let servicesurl1=`${this.baseurl}businessInterface/Client/clientServices_1_0?accountId=${siteid}&Request_type=${Request_type}&calling_user_details=IVISUSA`;
    let servicesurl2=`${this.baseurl}businessInterface/Client/clientServices_1_0?accountId=1003&Request_type=${Request_type}&calling_user_details=IVISUSA`;
    this.http.get(servicesurl1).subscribe((res:any)=>{
      this.siteservices$.next(res);
      if(res.Status !="Failed"){
        if(res.background != null){
          document.body.style.backgroundImage= `linear-gradient(325deg, rgba(0, 7, 39, 0.9) 18%, rgba(29, 0, 0, 0.9) 66%), url(${res.background})`
        }else{
          document.body.style.backgroundImage= `linear-gradient(325deg, rgba(0, 7, 39, 0.9) 18%, rgba(29, 0, 0, 0.9) 66%), url(assets/background.jpg)) no repeat`;
        }
      }
    },(error:any)=>{console.log(error);})
  }
  createuser(user:any){
    let url = "http://localhost:8080/CreateUser"
    return this.http.post(url, user);
  }


  getBiAnalyticsReport(siteid:any, startDate:any, endDate:any){
    let biAnalyticsReport = this.baseurl+'businessInterface/insights/biAnalyticsReport_1_0?';
    const api = `${biAnalyticsReport}SiteId=${siteid}&fromDate=${startDate}&toDate=${endDate}&calling_user_details=IVISUSA`
    return this.http.get(api)
  }
  getBiTrends(type:any, date:any){
    let biTrends = this.baseurl + "biDataReport/BiData?accountId=1001&analyticTypeId=";
    let url =`${biTrends}${type}&cameraDate=${date}`
    return this.http.get(url)
  }
  sessionstatus(){
    var hours = 24; // 0.01 is 35secs
    var now:any = new Date().getTime();
    var setupTime:any = localStorage.getItem('ge%1=wd2a');
    if (setupTime == null) {
        localStorage.setItem('ge%1=wd2a', now)
    } else {
    if(now-setupTime > hours*60*60*1000) {
        localStorage.setItem('ge%1=wd2a', now);
        return false;
      }
    }
    return true;
  }

  sendEmail(body:any, subject:string){
    let localurl= "http://10.0.2.191:8080/emailService";
    let url =`${this.baseurl}keycloakApp/emailService`;
    var a = this.storageService.getEncrData('user');
    // a.email = 'phaseakshay.vjtiprod19@gmail.com';
    let payload={
      userName: a.UserName,
      accessToken: a.access_token,
      subject:subject,
      body: body,
      userEmail:a.email,
      realm: a.Realm,
      calling_System_Detail: "portal",
      roles: ''
    };
    return this.http.post(url,payload)
  }

  onHTTPerror(e:any){
    this.error$.next(e)
    this.router.navigateByUrl('/error');
    // this.storageService.deleteStoredEncrData('user')
  }


  // for data treatments
  toggle(event:any){
    var element = event.target;
    element.classList.toggle("active");
    // if(this.data[index].isActive) {
    //   this.data[index].isActive = false;
    // } else {
    //   this.data[index].isActive = true;
    // }      
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
  toQR1(){
    const y = <any>(document.getElementById("modalcontent"));
    const x = <any>(document.getElementById("qrcode"));
    y.innerHTML='';
    const p = (y.parentNode);
    y.insertAdjacentHTML("beforeend", `<a  href='${this.baseurl1}usveclient/' target='_blank'><img src='assets/usclientqr.png' class='qrimg'></a>`);
    y.insertAdjacentHTML("afterBegin",
    "<div class='qrtxt'>Scan QR code for Safety Escort Service</div>");
    p.style.display = "flex";
  }
  toQR(){
    const y = <any>(document.getElementById("modalcontent"));
    const x = <any>(document.getElementById("qrcode"));
    y.innerHTML='';
    const p = (y.parentNode);
    if(this.siteservices$.value.Status != "Failed" && this.siteservices$.value?.Services?.safety_escort == "F"){
      y.insertAdjacentHTML("afterBegin",
      "<div class='qrtxt'>Please contact administration to subscribe the escort service</div>");
      p.style.display = "flex";
    }
    else{
      y.insertAdjacentHTML("beforeend", `<a  href='${this.baseurl1}usveclient/' target='_blank'><img src='assets/usclientqr.png' class='qrimg'></a>`);
      y.insertAdjacentHTML("afterBegin",
      "<div class='qrtxt'>Scan QR code for Safety Escort Service</div>");
      p.style.display = "flex";
    }
  }
  showOptions(){
    var x = document.getElementsByClassName('btnvisible');
    var y = document.getElementsByClassName('visibilitybtn');
    if((x[0]).classList.contains('show')){
      (x[0]).classList.remove('show');
      (y[0]).classList.remove('rotate');
    }else{(x[0]).classList.add('show');(y[0]).classList.add('rotate');};
  }
  showOptions1(){
    const y = <any>(document.getElementById("modalcontent"));
    const x = <any>(document.getElementById("topple"));
    (<any>y).appendChild(x);
    const z =  (y.children[0]);
    z.style.display = "block"; 
    z.style.margin = 20 + "px"; 
    z.style.width = 100+ "%";
    const p = (y.parentNode);
    p.style.display = "flex";
  }
  closemodal(){
    const y = <any>(document.getElementById("modal"));
    y.style.display = "none";
  }
  // add #topple to element you wish to insert in modal
  /* template to be added at bottom
  
  <div id="modal">
    <div class="close" (click)="closemodal()"></div>
    <div id="modalcontent"></div>
  </div>
  */
  makeTitleForTables(str:string){
    var newString = str.replace(/[^A-Z0-9]+/ig, " "); // remove symbols
    var splitStr = newString.toLowerCase().split(' '); // make first letter cap
    for (var i = 0; i < splitStr.length; i++) {
     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return (splitStr.join(' '))
  }

}

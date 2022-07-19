import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './auth/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  error$ = new BehaviorSubject<any>('');
  siteservices$ = new BehaviorSubject<any>('');
  tokenExpired$=new BehaviorSubject<boolean>(false);

  baseurl1='http://smstaging.iviscloud.net:8090/';
  // baseurl="http://usmgmt.iviscloud.net/";
  baseurl="http://usmgmt.iviscloud.net:777/";

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
    // console.log("sitelist: ",this.sitelisturl,payload);
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
    // console.log("camlist: ",this.camlisturl,payload);

    return this.http.post(this.camlisturl,payload);
  }
  error= '';
  refresh(){
    var a = this.storageService.getEncrData('user');
    let payload={
      userName: a.UserName,
      calling_System_Detail: "portal",
      refreshToken:a.refresh_token
    }
    this.http.post(this.refreshtokenurl,payload).subscribe((res:any)=>{
      // console.log("refresh: ",this.refreshtokenurl,payload,res);
      if(res.Status== 'Failed'){
        this.onHTTPerror({status:"Session Expired"}); 
        this.router.navigateByUrl("/login");
        this.error = ("Session Expired. Please login again")
      }
      if(res.Status == "Success"){
        this.storageService.storeEncrData('user', res);
      }
    },(error)=>{
      this.tokenExpired$.next(true);
      this.onHTTPerror(error);
    })
  }
  getServices(siteid:any){
    var Request_type = "Services";
    let servicesurl1=`${this.baseurl}businessInterface/Client/clientServices_1_0?accountId=${siteid}&Request_type=${Request_type}&calling_user_details=IVISUSA`;
    // console.log("services: ",servicesurl1);
    this.http.get(servicesurl1).subscribe((res:any)=>{
      localStorage.setItem('siteservices', JSON.stringify(res))
      this.siteservices$.next(res);
      if(res.Status !="Failed"){
        if(res.background != null){
          // document.body.style.backgroundImage= `linear-gradient(325deg, rgba(0, 7, 39, 0.9) 18%, rgba(29, 0, 0, 0.9) 66%), url(${res.background})`
          document.body.style.backgroundImage= `linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%),url(${res.background})`;

        }else{
          document.body.style.backgroundImage= `linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%), url(assets/background.jpg)) no repeat`;
        }
      }
    },(error:any)=>{console.log(error);})
  }  
  getHelpDeskCategories(){
    let url = `${this.baseurl}businessInterface/helpdesk/categoryList_1_0`;
    var a = this.storageService.getEncrData('user');
    let payload={
      userName: a.UserName,
      accessToken : a.access_token,
      calling_System_Detail: "portal"
    }
    return this.http.post(url,payload);
  }
  addHelpDeskRequest(payload:any ){
    let url = `${this.baseurl}businessInterface/helpdesk/addServiceRequest_1_0`;
    var a = this.storageService.getEncrData('user');
    var username= a.UserName;
    let body = new FormData(); 
    if(payload.time == null){payload.time == 'not mentioned'}
    body.append('siteId', payload.siteid);
    body.append('serviceName', payload.servicename);
    body.append('subServiceName', payload.subsevice);
    body.append('userName', username);
    body.append('calling_System_Detail', 'portal');
    body.append('description', payload.message);
    body.append('priority', payload.priority);
    body.append('preferredTimeToCall', payload.time);
    body.append('remarks',payload.remarks);
    body.append('Attachements', '');
    body.append('accessToken', a.access_token);
    // body.forEach((value,key) => {
    //     console.log(key+" "+value)
    // });
    return this.http.post(url, body);
  }
  updateHelpDeskRequest(payload:any ){
    let url = `${this.baseurl}businessInterface/helpdesk/updateServiceRequest_1_0`;
    var a = this.storageService.getEncrData('user');
    var username= a.UserName;
    let body = new FormData(); 
    if(payload.PrefTimeToCall != null){body.append('preferredTimeToCall', payload.PrefTimeToCall);}
    body.append('serviceName', payload.serviceCategoryName);
    body.append('subServiceName', payload.serviceSubCategoryName);
    body.append('userName', username);
    body.append('calling_System_Detail', 'portal');
    body.append('description', payload.description);
    body.append('priority', payload.priority);
    body.append('Attachements', '');
    body.append('accessToken', a.access_token);
    body.append('status',payload.status);
    body.append('remarks',payload.remarks);
    body.append('serviceId',payload.serviceId)
    body.append('siteId',payload.accountId)
    return this.http.post(url, body);
  }
  getHelpDeskRequests(){
    let url = `${this.baseurl}businessInterface/helpdesk/getServiceReq_1_0`;
    var a = this.storageService.getEncrData('user');
    var b = this.storageService.getEncrData('siteidfromgaurdpage');
    var payload = {
      userName: a.UserName,
      accessToken : a.access_token,
      calling_System_Detail:"portal",
      siteId: b.siteid  
    }
    return this.http.post(url, payload);
  }
  deleteHelpDeskRequests(serviceid:any){
    let url = `${this.baseurl}businessInterface/helpdesk/deleteServiceRequest_1_0`;
    var a = this.storageService.getEncrData('user');
    var b = this.storageService.getEncrData('siteidfromgaurdpage');
    var payload = {
      userName: a.UserName,
      accessToken : a.access_token,
      calling_System_Detail:"portal",
      siteId: b.siteid,
      serviceId:serviceid 
      }
    return this.http.post(url, payload);
  }
  getNonWorkingDays(siteid:any,year:any){
    let url = `${this.baseurl}businessInterface/Client/notWorkingDays_1_0?siteId=${siteid}&calling_System_Detail=IVISUSA&year=${year}`;
    return this.http.get(url);
  }
  getServices1(siteid:any){
    var Request_type = "Services";
    let servicesurl1=`${this.baseurl}businessInterface/Client/clientServices_1_0?accountId=${siteid}&Request_type=${Request_type}&calling_user_details=IVISUSA`;
    return this.http.get(servicesurl1)
  }
  getBiAnalyticsReport(siteid:any, startDate:any, endDate:any){
    // console.log("insights"+startDate, endDate)
    let biAnalyticsReport = this.baseurl+'businessInterface/insights/biAnalyticsReport_1_0?';
    const url = `${biAnalyticsReport}SiteId=${siteid}&fromDate=${startDate}&toDate=${endDate}&calling_user_details=IVISUSA`;
    const newurl = `${biAnalyticsReport}SiteId=${siteid}&fromDate=${startDate}&toDate=${endDate}&calling_user_details=IVISUSA`;
    const newurl1 = `${biAnalyticsReport}SiteId=${siteid}&fromDate=${startDate}&toDate=${endDate}&calling_System_Detail=IVISUSA`
    // console.log("bireport: ",url);
    return this.http.get(newurl1);
  }
  downloadReport(siteid:any, startdate:any, enddate:any){
    let url = 'http://smstaging.iviscloud.net:8090/bireports/download/getPdfReport'
    let url1 = `${this.baseurl}businessInterface/`
    var payload = {  
      id:siteid,
      startdate:startdate,
      enddate:enddate
    }
    return this.http.post(url, payload)
  }
  getBiAnalyticsResearch(siteid:any, startDate:any){
    // console.log("researchTrends"+siteid,startDate)
    let biAnalyticsReport = this.baseurl+'businessInterface/insights/getAnalyticsListforSite_1_0?';
    const newurl1 = `${biAnalyticsReport}SiteId=${siteid}&calling_System_Detail=IVISUSA&date=${startDate}%22`
    const newurl=this.baseurl+"businessInterface/insights/getAnalyticsListforSite_1_0?SiteId=1002&calling_System_Detail=IVISUSA&date=2022/03/01%22";
    // console.log("bireport: ",newurl);
    return this.http.get(newurl1);
  }
  getBiTrends1(siteid:any, date:any, typeid:any){
    let url1 =  `${this.baseurl}businessInterface/insights/analyticTrends_1_0?SiteId=${siteid}&date=${date}&calling_System_Detail=IVISUSA&analyticTypeId=${typeid}`;
    let url =  `${this.baseurl}businessInterface/insights/analyticTrends_2_0?SiteId=${siteid}&date=${date}&calling_System_Detail=IVISUSA&analyticTypeId=${typeid}`;
    return this.http.get(url)
  }
  getBiTrends(type:any, date:any){
    let biTrends = this.baseurl + "biDataReport/BiData?accountId=1001&analyticTypeId=";
    let url =`${biTrends}${type}&cameraDate=${date}`
    // console.log(url);
    return this.http.get(url)
  }
  getsiteid(siteid:any){
    let url = `${this.baseurl}cpus/sites/getBICustomerSiteId_1_0?accId=${siteid}`;
    return this.http.get(url)
  }
  downloadReport1(id:any, startdate:any, enddate:any){
    var x = new HttpHeaders({Accept: 'application/pdf', 'Content-Type': 'application/pdf', responseType: 'blob'});
    let url = `${this.baseurl}bireports/download/getPdfReport?id=${id}&startdate=${startdate}&enddate=${enddate}`;
    return this.http.get(url, { headers: x , responseType: 'blob' })
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
    let payload={
      userName: a.UserName,
      accessToken: a.access_token,
      subject:subject,
      body: body,
      userEmail:a.email,
      realm: a.Realm,
      calling_System_Detail: "portal",
      roles: '',
    };
    return this.http.post(url,payload)
  }
  getUserForProfile(){
    let url = this.baseurl + 'User/getUser_1_0'
    var a = this.storageService.getEncrData('user');
    var payload={
      username:a.UserName,
      email:a.email,
      callingUsername: a.UserName,
      accesstoken:a.access_token,
      callingSystemDetail:"portal"
    }
    return this.http.post(url,payload);
  }
  updateUserForProfile(payload:any){
    let url = this.baseurl + 'User/updateUser_1_0';
    var a = this.storageService.getEncrData('user');
    console.log(payload)
    // return this.http.post(url,payload);
  }
  updateProfilePic(image:File){
    let url = this.baseurl + 'User/UpdateProfile_1_0';
    var a = this.storageService.getEncrData('user');
    var username= a.UserName;
    let body = new FormData(); 
    body.append('clientUsername', a.UserName);
    body.append('accesstoken', a.access_token);
    body.append('callingSystemDetail', 'portal');
    body.append('image', image);
    body.forEach((value,key) => {
        console.log(key+" "+value)
    });
    return this.http.post(url, body);
  }











  onHTTPerror(e:any){
    this.error$.next(e)
    this.router.navigateByUrl('/error');
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
    var services = JSON.parse(localStorage.getItem('siteservices')!);
    console.log(services)
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
    var localheader = str.replace(/[^A-Z0-9]+/ig, " "); 
    var splitStr = localheader.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return (splitStr.join(' '))
  }


  updateprofile(){
    let url = this.baseurl+'businessInterface/insights/';
    var payload ={
    }
  }

  extractUniqueValueArray(arr:any, key:any){
    var abc: any[] =[];
    arr.forEach(function(el:any){
      abc.push(el[key]);
    });
    var unique = abc.filter((v, i, a) => a.indexOf(v) === i);
   return unique;
  }

}

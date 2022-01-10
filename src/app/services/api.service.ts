import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


loginurl ='http://smstaging.iviscloud.net:8080/auth/realms/IVISUSA/protocol/openid-connect/token';
sites ='http://smstaging.iviscloud.net:8090/businessInterface/sites/sitesList_1_0?uId=a3616dce-38b4-41d9-8fb8-032581d59500&calling_user_details=IVISUSA'; // working
cameras ='http://smstaging.iviscloud.net:8090/businessInterface/Cameras/CameraStreamList_1_0?uId=a3616dce-38b4-41d9-8fb8-032581d59500&';
biAnalyticsReport ='http://smstaging.iviscloud.net:8090/businessInterface/insights/biAnalyticsReport_1_0?';
logina ='http://smstaging.iviscloud.net:8090/businessInterface/login/user'

// bi analytics sample api
// http://smstaging.iviscloud.net:8090/businessInterface/insights/biAnalyticsReport_1_0?SiteId=1003&fromDate=2021/11/01&toDate=2022/12/01&calling_user_details=IVISUSA
//http://smstaging.iviscloud.net:8090/businessInterface/Cameras/CamerasList_1_0?uId=a3616dce-38b4-41d9-8fb8-032581d59500&accountId=1008&calling_user_details=IVISUSA

  constructor(private http: HttpClient) { }


  getSites(){
    return this.http.get(this.sites);
  }

  getCameras(siteid: any) {
    let url = `${this.cameras}accountId=${siteid}&calling_user_details=IVISUSA`;
    return this.http.get(url);
  }
}

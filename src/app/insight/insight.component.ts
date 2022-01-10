import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { AlertService } from '../services/alertservice/alert-service.service';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.css']
})
export class InsightComponent implements OnInit {

  startDate = "null";
  endDate = "null";
  reports : any;
  showLoader = false;
  // today= new Date(Date.now()).toLocaleString().split(',')[0];
  today = new Date();
  
  constructor(private http: HttpClient, private alertservice: AlertService)  { }

  ngOnInit(): void {
  }

  // For input Data of Start and End Date of Report
  startDateValue(){
      const date = (document.getElementById("startDate") as HTMLInputElement).value;
      this.startDate = date;
  }
  endDateValue(){
      const date = (document.getElementById("endDate") as HTMLInputElement).value;
      this.endDate = date;
      console.log(this.endDate)
  }
  onStartDateSelect(event:any){
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    if(x<10){a = '0' + x;} else{ a = x };
    if(y<10){b = '0' + y;} else { b = y };
    // this.startDate = a+'/'+b+'/'+ event.year;
    this.startDate = x+'/'+y+'/'+ event.year;

    var dateParts1:any = this.startDate.split("/");
    var startDateInStandardFormat = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]); 
    if(startDateInStandardFormat > this.today){
      this.alertservice.warning("Please Select Correct Start Date");
      this.startDate = "null";
    }
  }
  onEndDateSelect(event:any){
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    if(x<10){a = '0' + x;} else{ a = x };
    if(y<10){b = '0' + y;} else { b = y };
    // this.endDate = a+'/'+b+'/'+ event.year;
    this.endDate = x+'/'+y+'/'+ event.year;

    var dateParts:any = this.endDate.split("/");
    var endDateInStandardFormat = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
    if(endDateInStandardFormat > this.today){
      this.alertservice.warning("Please Select Correct End Date");
      this.endDate = "null";
    }
  }

  // For Acordion - Location
  toggleAccordian(event:any, index=0) {
    var element = event.target;
    element.classList.toggle("active"); 
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }


generateReport(){

  // var dateParts1:any = this.startDate.split("/");
  // var startDateInStandardFormat = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]); 
  // var dateParts2:any = this.startDate.split("/");
  // var endDateInStandardFormat = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0]); 
  // var z = dateParts1[1]+"/" +dateParts1[0]+"/"+dateParts1[2] 


  //  this.getAnalyticsData();

  // if(this.startDate != "null" || this.endDate !="null" ){
  //   alert("your start Date is "+this.startDate+" & your End Date is :"+ this.endDate);
   this.getAnalyticsData();
  // }else{
  //   alert("Please Choose Dates");
  //   if(this.reports == null ){
  //     console.log("get rid of tables")
  //   }
  // }
}

  // To get analytics report data to display according to date

dataAsObject(){
  const api = "http://smstaging.iviscloud.net:8090/businessInterface/insights/biAnalyticsReport_1_0?SiteId=1003&fromDate=2021/11/01&toDate=2022/12/01&calling_user_details=IVISUSA";
  // const api = "http://smstaging.iviscloud.net:8090/businessInterface/insights/biAnalyticsReport_1_0?SiteId=1003&fromDate="+this.startDate+"&toDate="+this.endDate;
  return this.http.get(api);

}
getAnalyticsData(){
  this.showLoader = true;
  this.dataAsObject().subscribe((data)=>{
  this.reports = data;
  console.log(this.reports)
  this.showLoader=false;  
  },
  (error)=> {
    setTimeout(()=>{ this.showLoader = false; }, 1000);
    console.error('Log error', error);
    this.alertservice.warning("Something went wrong please try after some time ")
  })
}


resObj =
{data:[{"Report_Name":"store_traffic_analysis",
  "Report_Details": [
  {
  "type": "Total Gas filling vehicles count",
  "icon": "https://ivisbi.com/v2/assets/img/icons/022-breakfast-11.png",
  "total": 0
  },
  {
  "type": "Only Gas Station Patrons",
  "icon": "https://ivisbi.com/v2/assets/img/icons/023-cleaning2.png",
  "total": 0
  },
  {
  "type": "Gas Station and Store Patrons",
  "icon": "https://ivisbi.com/v2/assets/img/icons/023-cleaning3.png",
  "total": 0
  },
  {
  "type": "Only Store Patrons",
  "icon": "https://ivisbi.com/v2/assets/img/icons/023-cleaning4.png",
  "total": 0
  },
  {
  "type": "Supermarket Total Group Size",
  "icon": "https://ivisbi.com/v2/assets/img/icons/024-watch4.png",
  "total": 0
  },
  {
  "type": "Outdoor Counter Vehicles Count",
  "icon": "https://ivisbi.com/v2/assets/img/icons/024-watch5.png",
  "total": 0
  }
  ]},
  {"Report_Name":"instore_analysis",
  "Report_Details": [
  {
  "type": "Washroom Cleaning",
  "icon": "https://ivisbi.com/v2/assets/img/icons/avg-turnaround-time3.png",
  "total": 0
  },
  {
  "type": "Freezer Activity",
  "icon": "https://ivisbi.com/v2/assets/img/icons/",
  "total": 0
  },
  {
  "type": "Fridge Activity",
  "icon": "https://ivisbi.com/v2/assets/img/icons/",
  "total": 0
  },
  {
  "type": "A Row Total Pickups",
  "icon": "https://ivisbi.com/v2/assets/img/icons/",
  "total": 0
  },
  {
  "type": "B Row Total Pickups",
  "icon": "https://ivisbi.com/v2/assets/img/icons/",
  "total": 0
  },
  {
  "type": "C Row Total Pickups",
  "icon": "https://ivisbi.com/v2/assets/img/icons/",
  "total": 0
  }
  ]}]
  }




}




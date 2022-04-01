import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.css']
})
export class InsightComponent implements OnInit {
  @ViewChild('optionlabel') optionlabel: ElementRef;


  startDate: any;
  endDate :any;
  reports : any;
  showLoader = false;
  today = new Date();
  maxDate: any;
  searchText: any;
  cols: any[];
  pipe = new DatePipe('en-us');
  keysVerification:any;


  constructor(
    private apiservice:ApiService, 
    private alertservice: AlertService,
    private storageService: StorageService,
    private router: Router,
    )  { }

  ngOnInit(): void {
    // for maxdate as today
    let x = (new Date(Date.now()).getFullYear());
    let y = (new Date(Date.now()).getMonth() + 1);
    let z = (new Date(Date.now()).getDate());
    this.maxDate = {year: x, month: y, day: z};
    this.getSitename();
  }
 
  sites:any
  reportsite="Loading...";
  currentsite: any;
  currentsiteid: any;
  placeholderhere= "Loading...";

  removeDuplicateSites(){
    var names_array_new =this.sites.siteList.reduceRight(function (r:any, a:any) {
      r.some(function (b:any) { return a.siteid === b.siteid; }) || r.push(a);
      return r;
    }, []);
    this.sites.siteList = names_array_new.reverse();
  }
  getSitename(){
    this.showLoader = true;
    this.apiservice.getSites().subscribe((res:any) => {     
      if(res.Status == 'Failed'){
        if(res.Message == "Data not available"){this.router.navigateByUrl('/guard')}
        else{
          this.apiservice.refresh();
          setTimeout(()=>{
            this.getSitename();
          },1000)
        }
       
      }else{
        this.sites = res;
        this.removeDuplicateSites();
        this.showLoader = false;
        setTimeout(() => {this.optionlabel.nativeElement.click()}, 500);
        this.firstreport();
        }
    },(error)=>{
      if(error.ok== false){
        this.apiservice.onHTTPerror(error);
      }
      console.log("Something went wrong");
    })
  }
  getreports(x:any,y:any,z:any){
    this.placeholderhere= "Loading...";
    this.showLoader = true;
    this.apiservice.getBiAnalyticsReport(x,y,z).subscribe((res:any)=>{
      this.reportsite = this.currentsite
      // this.showOptions();   
      this.showLoader=false;  
      var ar:any = []
      if(res != null){
          res.forEach((el:any) => {  
            el.data.forEach((eld:any) => {
            var keyslist = (Object.keys(eld));
            const ary:any = [];
            keyslist.forEach(elem => {
              if(elem != 'icon' && elem != 'type'){
                var capsName = this.apiservice.makeTitleForTables(elem);
                ary.push({field: elem, header: capsName})
              }
            });
            this.cols = ary;
            this.keysVerification = ar.concat(keyslist.filter((item) => ar.indexOf(item) < 0))
          }); 
        }); 
      }     
      this.reports = res; 
      if(this.reports == null){this.placeholderhere ="Please choose different dates to view the reports"}
    },
     (error:any)=> {
       this.showLoader = false;
       setTimeout(()=>{ this.showLoader = false; }, 1000);
       this.alertservice.warning("Something went wrong please try after some time ")
     });
  }
  firstreport(){
    var p =  this.storageService.getEncrData('siteidfromgaurdpage');
    if(p == null){this.router.navigateByUrl('/guard')}
    else{
      this.currentsite = p.sitename;
      this.currentsiteid = p.siteid;
      var siteid = p.siteid;
      this.startDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'dd/MM/yyyy');
      this.endDate = this.startDate;
      var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
      var startDateParts:any = this.startDate.split("/");
      var endDateParts:any = this.endDate.split("/");
      var sd = this.months[Number(startDateParts[1])-1]+' '+startDateParts[0] +', '+ startDateParts[2]
      var ed = this.months[Number(endDateParts[1])-1]+' '+ endDateParts[0] +', '+endDateParts[2];  
      if(sd != ed){this.selectedSpan = sd +' - '+' '+ ed}else{this.selectedSpan = sd}
      this.getreports(siteid,yesterday,yesterday);
      this.displaYstartDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'MM/dd/yyyy');
      this.displaYendDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'MM/dd/yyyy');
    }
  }
  siteClicked(site:any){
    this.currentsite = site.sitename;
    this.currentsiteid = site.siteid;
    this.optionlabel.nativeElement.click()
  }
  // For input Data of Start and End Date of Report
  startDateValue(){
      const date = (document.getElementById("startDate") as HTMLInputElement).value;
      this.startDate = date;
  }
  endDateValue(){
    const date = (document.getElementById("endDate") as HTMLInputElement).value;
    this.endDate = date;
  }
  displaYstartDate:any;
  displaYendDate:any;
  onDateSelect(event:any, select:any){
    this.selectedMonth = '';
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    if(x<10){a = '0' + x;} else{ a = x };
    if(y<10){b = '0' + y;} else { b = y };
    if(select == 'end'){this.endDate = a+'/'+b+'/'+ event.year; this.displaYendDate=b+'/'+a+'/'+ event.year};
    if(select == 'start'){this.startDate = a+'/'+b+'/'+ event.year; this.displaYstartDate=b+'/'+a+'/'+ event.year};
  }

generateReport(){
  var dateParts:any = this.startDate.split("/");
  var startDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
  var dateParts1:any = this.endDate.split("/");
  var endDate = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]); 
  if(this.startDate != "null" && this.endDate !="null" ){
    if(startDate > endDate){
      this.alertservice.warning("Start Date cannot be later than End Date")
     }else{
      this.getAnalyticsData();
     }
   }else{
     if(this.reports == null ){
        this.alertservice.warning("Currently, we dont have data for this table")
     }
  }
  this.closemodal()
}

// To get analytics report data to display according to date
getAnalyticsData(){
  this.showLoader = true;
  var x = this.currentsiteid;
  var y = this.startDate.split("/").reverse().join("/");
  var z = this.endDate.split("/").reverse().join("/");
  var startDateParts:any = this.startDate.split("/");
  var endDateParts:any = this.endDate.split("/");
  var sd =  this.months[Number(startDateParts[1])-1]+' '+startDateParts[0] +', '+ startDateParts[2];
  var ed = this.months[Number(endDateParts[1])-1]+' '+ endDateParts[0] +', '+endDateParts[2];
  if(sd != ed){this.selectedSpan = sd +' - '+' '+ ed}else{this.selectedSpan = sd}
  this.getreports(x,y,z);
}


// for month selection from search bar
visible= false
selectedSpan="Loading...";
openmonths(event:any){
  this.visible = true;
  var x  = (document.getElementById("searchbox") as HTMLInputElement);
  x.classList.add("padd")
}
loadMonthReport(){
  this.showLoader = true 
  var startDate = this.startDate.split("/").reverse().join("/");
  var endDate = this.endDate.split("/").reverse().join("/");
  this.getreports(this.currentsiteid,startDate,endDate);
}
dateNavigate($event: NgbDatepickerNavigateEvent) {
  var month = $event.next.month;
  var year = $event.next.year;
  var lastDate = new Date(year, month, 0).getDate();
  var a; var b
  if(month<10){a = '0' + month;} else{ a = month };
  this.startDate = '01/' + a + '/'+$event.next.year ;
  this.endDate = lastDate + '/' + a + '/' + $event.next.year ;
}
// for months selector
years = Array((new Date().getUTCFullYear()) - ((new Date().getUTCFullYear()) - 20)).fill('').map((v, idx) => (new Date().getUTCFullYear()) - idx);
months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
selectedMonth="Select Month"
nextYear(){
  var y = this.years[0]+1;
  var z = new Date().getUTCFullYear();
  if(this.years[0] < z){this.years.splice(0, 0, y);}
}
prevYear(){
  if( this.years[0] > 2014){this.years = this.years.slice(1);}
}
currentMonthIndex = ((new Date()).getMonth());
currentyear = new Date().getUTCFullYear();
monthselected = false;
selectedmonth(i:any){
  if((this.years[0] == this.currentyear && i<=this.currentMonthIndex) || this.years[0] < this.currentyear ){
    this.monthselected =true;
    this.visible = false;
    this.selectedMonth = this.months[i] +', '+ this.years[0];
    var month = i+1;
    var year = this.years[0];
    if(this.years[0] == this.currentyear && i==this.currentMonthIndex){
      var lastDate = new Date().getDate();
    }else{
      var lastDate = new Date(year, month, 0).getDate();
    }
    var a;
    if(month<10){a = '0' + month;} else{ a = month };
    this.startDate = '01/' + a + '/'+year ;
    this.endDate = lastDate + '/' + a + '/' + year ;

    this.displaYstartDate = a + '/01/' +year;
    this.displaYendDate = a +'/' + lastDate + '/' + year;
  }
} 

searchMonthreport(){
  if(this.monthselected == true){
    this.visible = false;
    this.getAnalyticsData();
  }
}

onInput(e:any){
  var x = e.target.value;
  var items = this.sites.siteList
  var a:any[] = items.filter((item:any) => JSON.stringify(item).toLowerCase().indexOf(x.toLowerCase()) !== -1);
  if(a.length!=0){
    if(!this.optionlabel.nativeElement.classList.contains('active')){
      this.optionlabel.nativeElement.click();
    }
  }
  (this.optionlabel.nativeElement.nextElementSibling.scrollHeight)
}
  
toggleAccordian(event:any) {
  if(this.sites?.siteList.length > 1){
    return this.apiservice.toggle(event)
  }
}
showOptions(){return this.apiservice.showOptions()}
showOptions1(){return this.apiservice.showOptions1()}
closemodal(){return this.apiservice.closemodal();}
toQRmodal(){return this.apiservice.toQR()}
makeTitleForTable(a:any){return this.apiservice.makeTitleForTables(a)}

}




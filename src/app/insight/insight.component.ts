import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';
import { NgbDate, NgbDatepickerNavigateEvent, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  weekends:any;


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
      this.showLoader =false;    
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
        var sitelist = this.sites.siteList
        const sortAlphaNum = (a:any, b:any) => a.sitename.localeCompare(b.sitename, 'en', { numeric: true })
        sitelist = this.sites.siteList.sort(sortAlphaNum)
        this.sites.siteList = sitelist;        
        this.removeDuplicateSites();
        this.showLoader = false;
        /* to automatically open sites panel on page load*/
        // setTimeout(() => {this.optionlabel.nativeElement.click()}, 500);
        this.firstreport();
        }
    },(error)=>{
      if(error.ok== false){
        this.apiservice.onHTTPerror(error);
      }
      console.log("Something went wrong");
    })
    this.getsitenonworkingdays();
  }


  getreports(x:any,y:any,z:any){
    this.placeholderhere= "Loading...";
    this.showLoader = true;
    this.apiservice.getBiAnalyticsReport(x,y,z).subscribe((res:any)=>{      
      // console.log(res);
      if(res.Status != "Failed"){
        res = res.AnalyticsReportList;
        this.reportsite = this.currentsite;
        if(res.length == 0){res = null};
        // this.showOptions();   
        this.showLoader=false;  
        var ar:any = []
        if(res != null){
            res.forEach((el:any) => {  
              el.data.forEach((eld:any) => {
              var keyslist = (Object.keys(eld));
              let ary:any = [];
              keyslist.forEach(elem => {
                if(elem != 'icon' && elem != 'type'){
                  var capsName = this.apiservice.makeTitleForTables(elem);
                  ary.push({field: elem, header: capsName})
                }
              });
              ary = ary.sort((a:any, b:any) => (a.header > b.header ? 1 : -1));
              this.cols = ary;
              this.keysVerification = ar.concat(keyslist.filter((item) => ar.indexOf(item) < 0))
            }); 
          }); 
        }    
        this.reports = res; 
        if(this.reports == null){this.placeholderhere ="Please choose different dates to view the reports"}
      }else{
        this.reportsite = this.currentsite;
        this.showLoader =false;
        this.reports = null;
        this.placeholderhere ="Please choose different dates to view the reports"
      }
    },
     (error:any)=> {
       this.showLoader = false;
       setTimeout(()=>{ this.showLoader = false; }, 1000);
       this.alertservice.warning("Something went wrong please try after some time ")
     });
  }
  getcols(r:any){
    let ary:any = [];
    const result = r.data.reduce( (e1:any, e2:any) => e1.length>e2.length ? e1: e2 );
    // console.log( "Element of arr having longest a:", result );
    var keys = (Object.keys(result));
    keys.forEach((elem:any) => {
      if(elem != 'icon' && elem != 'type'){
        var capsName = this.apiservice.makeTitleForTables(elem);
        ary.push({field: elem, header: capsName})
      }
    });
    ary = ary.sort((a:any, b:any) => (a.header > b.header ? 1 : -1));
    return ary;
  }
  firstreport(){
    var p =  this.storageService.getEncrData('siteidfromgaurdpage');
    if(p == null){this.router.navigateByUrl('/guard')}
    else{
      this.currentsite = p.sitename;
      this.currentsiteid = p.siteid;
      // this.setweekenddisable();
      this.getsitenonworkingdays();
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
  getsitenonworkingdays(){
    var p =  this.storageService.getEncrData('siteidfromgaurdpage');
    var siteid=p.siteid;
    var year = (new Date()).getFullYear();
    var yeararr=[year, year-1, year-2, year-3, year-4]
    var datesarr:any=[]
    yeararr.forEach((el:any) => {
      this.apiservice.getNonWorkingDays(siteid,el).subscribe((res:any)=>{
        if(res.Status=="Success"){
          datesarr.push(res.NotWorkingDaysList);
          this.datesarr = datesarr.flat()
        }
      })
    });
    setTimeout(() => {
      this.dates(this.datesarr)
    }, 2000);
  }
  disabledays:any
  siteClicked(site:any){
    this.storageService.storeEncrData('siteidfromgaurdpage', site);
    this.currentsite = site.sitename;
    this.currentsiteid = site.siteid;
    this.optionlabel.nativeElement.click();
    // this.setweekenddisable();
    this.getsitenonworkingdays();
  }
  setweekenddisable(){
    // this.dates(this.datesarr)
    var a;
    //  add beow when received no data dates as array
    this.apiservice.getServices1(this.currentsiteid).subscribe((res:any)=>{
      a = res.nonWorkingDays;
      if(a == "Sat-Sun"){
        this.disabledays = this.weekend
      }else if(a == "Sun"){
        this.disabledays = this.sunday
      }else{
        this.disabledays = false;
      }
    })
  }
  weekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return  d.getDay() === 0 || d.getDay() === 6; // sat sun off    
  }
  sunday(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return  d.getDay() === 0  // only sun off
  }
  datesarr = ["2022-05-02","2022-05-03","2022-05-21","2022-05-24","2022-05-11","2022-05-06"];
  dates(arr:any[]){
    // console.log(arr);
    arr.forEach(el => {
      var splits:any = el.split("-"); 
      var newdate;
      // console.log(+splits[2], +splits[1], +splits[0]); 
      this.disabledDates.push({year:+splits[0],month:+splits[1],day:+splits[2]})
    });
    this.disabledays = this.isDisabled;
  }
  disabledDates:NgbDateStruct[]=[
    {year:2019,month:2,day:26}
  ]
  isDisabled=(date:NgbDateStruct,current: {month: number,year:number})=> {
    //in current we have the month and the year actual
    return this.disabledDates.find(x=>new NgbDate(x.year,x.month,x.day).equals(date))?
         true:false;
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
  minenddate={year: 2014, month: 1, day: 1};
  onDateSelect(event:any, select:any){
    this.selectedMonth = '';
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    if(x<10){a = '0' + x;} else{ a = x };
    if(y<10){b = '0' + y;} else { b = y };
    if(select == 'end'){this.endDate = a+'/'+b+'/'+ event.year; this.displaYendDate=b+'/'+a+'/'+ event.year};
    if(select == 'start'){this.startDate = a+'/'+b+'/'+ event.year; this.displaYstartDate=b+'/'+a+'/'+ event.year;
    this.minenddate={year: event.year, month: event.month, day: event.day};
    };
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
  this.closemodal();

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




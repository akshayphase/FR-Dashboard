import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';
import { ChartService } from '../services/charts/chart.service';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  @ViewChild('optionlabel') optionlabel: ElementRef;
  @ViewChild('optionlabel1') optionlabel1: ElementRef;
  @ViewChild('op') panel: ElementRef;


startDate: any;
endDate :any;
reports : any;
showLoader = false;
today = new Date();
maxDate: any;
minDate:any;
displayDate:any;
sites:any;
rsdata:any;
currentsite:any;
currentsiteid:any;
searchText: any;
searchField: any;
reportsite="Loading...";
placeholderhere= "Loading...";
pipe = new DatePipe('en-us');
yesterday:any;
lastday:any;
lastmonth:any;
prevmonth:any;
weekseq:any;
weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

constructor(
  private apiservice:ApiService,
  private chartservice:ChartService,
  private storageService:StorageService,
  private router:Router) { }

ngOnInit(): void {
    // for maxdate as today
    let x = (new Date(Date.now()).getFullYear());
    let y = (new Date(Date.now()).getMonth() + 1);
    let z = (new Date(Date.now()).getDate());
    this.maxDate = {year: x, month: y, day: z};
    this.minDate={year: 2014, month: 1, day: 1}
    var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
    this.gettimelines(yesterday);
    this.displayDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'MM/dd/yyyy');

    this.getSitename();

    // this.getResearchData('1002','2022/03/01');
    // this.getBiTrends("1002","2022/03/01","8");
    // this.getTrendsData();  
}

seletedresearch:any;
getResearchData(siteid:any, date:any){
  this.gettimelines(date)
  this.showLoader=true;
  this.reportsite = this.currentsite;
  this.apiservice.getBiAnalyticsResearch(this.currentsiteid,date).subscribe((res:any)=>{
    // console.log(res, this.currentsiteid,date)
    if(res.Status != "Failed"){
      this.placeholderhere = "Loading...";
      var filter;
      filter = res.AnalyticsList.sort(function (a:any, b:any) {return a.service.localeCompare(b.service);});
      this.rsdata = filter;
      if(this.currentfield == null){
        this.seletedresearch=filter[0];
      }
      this.currentfield =this.seletedresearch.service;
      this.currentfieldid = this.seletedresearch.serviceId;
      // console.log(this.currentsiteid, this.currentfield,this.currentfieldid)
      this.getBiTrends();
      this.showLoader=false;
    }else{
      this.showLoader=false;
      this.placeholderhere = "Data is not available for selected date. Please choose different date.";
      const y = <any>(document.getElementById("graphholder"));
      y.innerHTML = '';
      this.rsdata = null;
    }
  })
}
graphsdata:any;
getBiTrends(){
  var date;
  var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
  if((this.startDate) == null){date = yesterday}else{
    var startDateParts:any = this.startDate.split("/");
    date =  [(startDateParts[2])]+'/'+startDateParts[1] +'/'+ startDateParts[0];
  }
  this.showLoader=true;
  this.apiservice.getBiTrends1(this.currentsiteid, date, this.currentfieldid).subscribe((res:any)=>{
    // console.log(res)
    this.graphsdata = res?.AnalyticsTrends;
    // console.log(this.graphsdata)
    const y = <any>(document.getElementById("graphholder"));
    y.innerHTML = '';
    this.graphsdata.forEach((el:any) => {
      y.insertAdjacentHTML("beforeend",
      `<div class='card' style="margin:10px; padding:10px;"><div id=${'container'+String(this.graphsdata.indexOf(el))}></div></div>`);
      this.mychart(el,this.graphsdata.indexOf(el))
    });
    this.showLoader = false;
  })
}
mychart(info:any, index:any){
  var obj= info[Object.keys(info)[0]]
  var arr=[]
  for(var item in obj){
    if(String(obj[item]).includes(":")){
      obj[item] = obj[item].replace(/[^\d.]/g, '.');
      // console.log(obj[item])
    }
    arr.push([item,Number(obj[item])])
  }
  var subtitle = '';
  if(Object.keys(info)[0] == 'DAY'){subtitle='Information about last seven days performance with respect to the selected date'}
  if(Object.keys(info)[0] == 'WEEK'){subtitle='Information about last four weeks performance with respect to the week of selected date'}
  if(Object.keys(info)[0] == 'MONTH'){subtitle='Information about last three months performance with respect to the month of selected date'}
  if(Object.keys(info)[0] == 'QUARTER'){subtitle='Information about last four quarters performance with respect to the quarter of selected date'}
  var charttype = 'line';
  var threeD = false;
  var title = Object.keys(info)[0];
  var antype = Object.keys(info)[0];
  var elementid = 'container'+String(index);
  var data =  
    arr;
    //[ ['91 Minutes', 91],
    // ['50 Minutes', 50],
    // ['66 Minutes', 66] ];
    //  [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
    //   {y: 216.4, marker: { fillColor: '#BF0B23', radius: 10 } }, 194.1, 95.6, 54.4];
  this.chartservice.createchart(charttype, threeD, title, subtitle, antype, data, elementid)
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
      res.siteList.sort(function (a:any, b:any) {return a.sitename.localeCompare(b.sitename);});
      // console.log(res)
      this.sites = res;
      this.removeDuplicateSites();
      this.showLoader = false;
      // setTimeout(() => {this.optionlabel.nativeElement.click()}, 500);
      this.firstreport();
      }
  },(error)=>{
    if(error.ok== false){
      this.apiservice.onHTTPerror(error);
    }
    console.log("Something went wrong");
  })
}
removeDuplicateSites(){
  var names_array_new =this.sites.siteList.reduceRight(function (r:any, a:any) {
    r.some(function (b:any) { return a.siteid === b.siteid; }) || r.push(a);
    return r;
  }, []);
  this.sites.siteList = names_array_new.reverse();
}
firstreport(){
  var p =  this.storageService.getEncrData('siteidfromgaurdpage');
  if(p == null){this.router.navigateByUrl('/guard')}
  else{
    this.currentsite = p.sitename;
    this.reportsite = this.currentsite;
    this.currentsiteid = p.siteid;
    var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
    this.getResearchData(this.currentsiteid,yesterday);
  }
}
siteClicked(e:any,site:any){
  this.storageService.storeEncrData('siteidfromgaurdpage', site);
  this.currentsite = site.sitename;
  this.currentsiteid = site.siteid
  // e.target.parentNode.parentNode.previousElementSibling.click()
  this.optionlabel.nativeElement.click();
  this.rsdata = null;
  var date;
  var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
  if((this.startDate) == null){date = yesterday}else{
    var startDateParts:any = this.startDate.split("/");
    date =  [(startDateParts[2])]+'/'+startDateParts[1] +'/'+ startDateParts[0];
  }
  this.getResearchData(this.currentsiteid,date);
}
currentfield:any;
currentfieldid:any;
fieldClicked(e:any,field:any){
  this.graphsdata = null;
  this.currentfield = field.service;
  this.currentfieldid = field.serviceId;
  this.optionlabel1.nativeElement.click();
  this.seletedresearch = field;
}
getResearchonClick(){
  this.placeholderhere = "Loading...";
  if(this.startDate==null){
    var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
    this.getResearchData(this.currentsiteid,yesterday);
  }else{
    var startDateParts:any = this.startDate.split("/");
    var sd = (startDateParts[2])+'/'+startDateParts[1] +'/'+ startDateParts[0]
    this.getResearchData(this.currentsiteid,sd);
  }
  this.closemodal();
}
onDateSelect(event:any, select:any){
  var x = event.day;
  var y = event.month;
  var a;
  var b;
  if(x<10){a = '0' + x;} else{ a = x };
  if(y<10){b = '0' + y;} else { b = y };
  if(select == 'start'){this.startDate = a+'/'+b+'/'+ event.year; this.displayDate=b+'/'+a+'/'+ event.year};
}
gettimelines(date:any){
  var d = new Date(date)
  this.yesterday =this.pipe.transform(new Date().setDate(d.getDate() - 1), 'yyyy/MM/dd');
  if((d.getDay()) != 0){this.lastday = this.weekdays[(d.getDay())];}
  else{this.lastday = this.weekdays[0]}
  if((d.getMonth()) != 0){this.lastmonth = this.months[(d.getMonth()) -1]; this.prevmonth=this.months[(d.getMonth()) -2]}
  else{this.lastmonth = this.months[0];this.prevmonth = this.months[11]; } 
  var seq=['first', 'second', 'third', 'fourth', 'fifth']
  this.weekseq= seq[(Math.ceil(d.getDate() / 7))]
}
onInput(e:any){
  var x = e.target.value;
  var items = this.sites.siteList
  var a:any[] = items.filter((item:any) => JSON.stringify(item).toLowerCase().indexOf(x.toLowerCase()) !== -1);
  if(a.length!=0){
    if(!this.optionlabel.nativeElement.classList.contains('active')){
      this.optionlabel.nativeElement.click();
      this.optionlabel1.nativeElement.click();
    }
  }
  (this.optionlabel.nativeElement.nextElementSibling.scrollHeight)
  (this.optionlabel1.nativeElement.nextElementSibling.scrollHeight)
}

toggleAccordian(event:any) { return this.apiservice.toggle(event)  }
showOptions(){return this.apiservice.showOptions()}
showOptions1(){return this.apiservice.showOptions1()}
closemodal(){return this.apiservice.closemodal();}
toQRmodal(){return this.apiservice.toQR()}














// for reports
trenddata:any;
filtereddata:any;
xaxis:any = [];
yaxis:any = [];
antypes:any = [];
annames:any = [];
getTrendsData(){
  this.apiservice.getBiTrends('PEOPLECOUNT','01-17-2022').subscribe((res:any)=>{
    // console.log(res)
    this.trenddata = res;
    // for filtering type and sorting wrt timeline
    this.filtereddata = this.trenddata.filter((el:any) => el.analyticTypeValue =="ENTER")
    this.filtereddata.sort(function (a:any, b:any) {return a.arrivalTime.localeCompare(b.arrivalTime);});
    // making chart array by adding count for condition
    const a = Array.from(this.filtereddata.reduce(
      (m:any, {cameraHour, count}:{cameraHour:any, count:any} ) => m.set(cameraHour, (m.get(cameraHour) || 0) + count), new Map
      ), ([cameraHour, count]) => ({cameraHour, count}));
      a.forEach(el => {this.xaxis.push(el.cameraHour); this.yaxis.push(el.count)});
    // making array of analytics names from recieved data
    const cde = Array.from(this.trenddata.reduce((m:any, 
      {analyticTypeId}:{analyticTypeId:any} ) => m.set(analyticTypeId, (m.get(analyticTypeId) || 0)), 
      new Map), ([analyticTypeId]) => ({analyticTypeId}));
      cde.forEach(el => {this.annames.push(el.analyticTypeId)});
      (this.selectedanalyticname = this.annames[0])
    // making array of analytics types from recieved data
    const abc = Array.from(this.trenddata.reduce((m:any, 
      {analyticTypeValue}:{analyticTypeValue:any} ) => m.set(analyticTypeValue, (m.get(analyticTypeValue) || 0)), 
      new Map), ([analyticTypeValue]) => ({analyticTypeValue}));
      abc.forEach(el => {this.antypes.push(el.analyticTypeValue)});
      (this.selectedanalytictype= this.antypes[0])
      if(this.filtereddata){
        // setTimeout(()=>{this.instantiateChart();},500);
      }
  })
}
currentItem: any;
selectedanalytictype:any;selectedanalyticname:any;
selectAnalytic(event:any, param:any){
  if(param == "type"){this.selectedanalytictype = (event.target.innerText);}
  if(param == "name"){this.selectedanalyticname = (event.target.innerText);}
  var x = event.target.parentNode.parentNode;
  x.style.maxHeight = null;
  (x.previousElementSibling.classList.toggle('active'))
}

getTrendsDataonclick(){
  // console.log(this.startDate, this.endDate, this.selectedanalyticname, this.selectedanalytictype)
  this.getResearchData(this.currentsiteid,this.yesterday);
}

//chart library code - linechart
public lineChartLabels: Label[] = this.xaxis;
public lineChartOptions: (ChartOptions&{annotation?: any}) = {responsive: true,};
public lineChartColors: Color[] = [{
    borderColor: 'gradient',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },];
public lineChartLegend = true;
public lineChartType:any = 'line';
public lineChartPlugins = [];
instantiateChart(){
  const canvas = <HTMLCanvasElement> document.getElementById('chart');
  const ctx:any = canvas.getContext('2d');
  var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  gradientStroke.addColorStop(0, "#80b6f4");
  gradientStroke.addColorStop(1, "#f49080");
}
public lineChartData: ChartDataSets[] = [
  { data: this.yaxis,
  label: "PEOPLECount",
  lineTension: 0,     
  pointBorderColor: "#55bae7",
  fill: false,
 },
];
//chart library code - bar chart
public barChartLabels: Label[] = this.xaxis;
public barChartType: ChartType = 'bar';
public barChartLegend = true;
public barChartPlugins = [];
public barChartOptions: ChartOptions = {
  responsive: true,
};
public barChartData: ChartDataSets[] = [
  { data: this.yaxis, label: 'PEOPLE Count' },
  // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
];




daaata=[
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:26:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 10, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:06:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:21:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:35:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:16:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:26:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 3, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "09:22:00", cameraDate: "01-10-2022", cameraHour: "09", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:15:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:12:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:10:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 12, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},

{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:35:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 5, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:40:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:08:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:50:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:55:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:14:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 3, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "09:58:00", cameraDate: "01-10-2022", cameraHour: "09", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:36:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:50:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:49:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"}, 

{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:26:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 5, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:06:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:21:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:35:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "08:16:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "10:26:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 3, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "09:22:00", cameraDate: "01-10-2022", cameraHour: "09", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:15:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "08:12:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "10:10:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},

{
  accountId: "1004",
  analyticTypeId: "PEOPLECOUNT",
  analyticTypeValue: "ENTER",
  arrivalTime: "07:06:00",
  cameraDate: "01-10-2022",
  cameraHour: "07",
  cameraName: "IVISUSA1009",
  count: 1,
  countId: 1,
  countType: "enter",
  departureTime: "0",
  id: 19,
  refactorBy: 0,
  refactoringTo: "",
  totalTime: "0"
}
]


calcperc(i:any){
  console.log(i)
  if(i.count.includes("/") || i.variance.includes("/")){
    // console.log((parseInt(i.count)-parseInt(i.variance)),(i.count),(i.variance))
    return Math.ceil((i.variance));
  }
  else if(i.count.includes(":") || i.variance.includes(":")){
    // console.log((parseInt(i.count)-parseInt(i.variance)),(i.count),(i.variance))
    return Math.ceil((i.variance));
  }
  else{
    var percdiff  = ((parseInt(i.variance))*100)/parseInt(i.count);
    if(i.count == 0){var diff = 0;}
    else{diff = Math.ceil(percdiff)}
    // console.log((parseInt(i.count)-parseInt(i.variance)),(i.count),(i.variance),diff,percdiff)
    return diff;
  }
}
}




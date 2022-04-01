import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  @ViewChild('op') panel: ElementRef;


  startDate: any;
  endDate :any;
  reports : any;
  showLoader = false;
  today = new Date();
  maxDate: any;

  constructor(private apiservice:ApiService) { }

  ngOnInit(): void {
    // this.getTrendsData();  
  }

  onDateSelect(event:any, select:any){
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    if(x<10){a = '0' + x;} else{ a = x };
    if(y<10){b = '0' + y;} else { b = y };
    if(select == 'end'){this.endDate = a+'/'+b+'/'+ event.year;};
    if(select == 'start'){this.startDate = a+'/'+b+'/'+ event.year;};
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

  // for reports
  trenddata:any;
  filtereddata:any;
  xaxis:any = [];
  yaxis:any = [];
  antypes:any = [];
  annames:any = [];
  getTrendsData(){
    this.apiservice.getBiTrends('PEOPLECOUNT','01-17-2022').subscribe((res:any)=>{
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
  getTrendsDataonclick(){
    // console.log(this.startDate, this.endDate, this.selectedanalyticname, this.selectedanalytictype)
    this.showOptions();
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


  toggleAccordian(event:any) { return this.apiservice.toggle(event)  }
  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}

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

}



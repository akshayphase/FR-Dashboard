import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-gaurd',
  templateUrl: './gaurd.component.html',
  styleUrls: ['./gaurd.component.css']
})
export class GaurdComponent implements OnInit {

  @ViewChild('grids') gridCont: ElementRef ;
  @ViewChild('title') cameraName: ElementRef;
  @ViewChild('status') status: ElementRef;
  @ViewChild('camerabox') camerabox: ElementRef;
  @ViewChild('optionlabel') optionlabel: ElementRef;
  @ViewChild('panel') panel: ElementRef;



  showLoader = false;
  sites:any|[];
  cameras:any|[];
  cameralist:any|[];
  viewPanelData:any;
  searchText: any;

  // rtsp://admin:xx2317xx2317@10.0.2.242:559/cam/realmonitor?channel=6&subtype=1 
  constructor(private apiService:ApiService, private changeDetection: ChangeDetectorRef, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getSitename();
  }
  ngAfterViewInit(){
    this.adjustGrid();
    this.changeDetection.detectChanges();
  }
  // for sites and data of cameras
  opened = null;
  getSitename(){
    this.showLoader = true;
    this.apiService.getSites().subscribe((res) => {

      this.sites = res;
      //this.currentsite = this.sites.siteList[0].siteid
      this.apiService.getCameras(this.sites.siteList[0].siteid).subscribe((res)=>{
        this.currentsite = this.sites.siteList[0].siteid;
        this.opened = this.currentsite;
        this.showLoader = false;
        this.cameras = res;
        this.pagination();
        this.changeDetection.detectChanges();
        setTimeout(() => {
          this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
          this.optionlabel.nativeElement.click()
        }, 1000);
      })
    })
  }
  
  currentsite:any; // to save currentsite
  getCameras(event:any, site:any, index:any){
    this.opened = null;
    this.pagenumber = 1;
    this.viewPanelData = site;
    var siteid = site.siteid;
    if(siteid != this.currentsite){
      this.cameras = null;
      this.paginatedCameraList = null;
      this.changeDetection.detectChanges();
      this.loadCameraList(event, siteid, index);
      // this.toggleAccordian(event, index);
    }else{
      this.toggleAccordian(event, index)
    }
  }
  loadCameraList(event:any, siteid:any, index:any){
    this.currentsite = siteid;
    this.showLoader = true;
    this.apiService.getCameras(siteid).subscribe((res)=>{
      this.cameras = res
      this.pagination();
      this.changeDetection.detectChanges();
      this.showLoader = false;
      this.toggleAccordian(event, index)
    })
  }
  toggleAccordian(event:any, index:any) {
    var element = event.target;
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      element.classList.remove("active");  
      panel.style.maxHeight = null;
    } else {
      element.classList.add("active");  
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }


  // grid display functions and pagination
  gridClicked :any;
  cameraGridSingle(){
    this.pagenumber = 1;
    this.gridClicked = 1;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(1, 1fr)";
    this.resizeFonts();
    x.style.width = 70+ "%";
  }
  cameraGridDouble(){
    this.pagenumber = 1;
    this.gridClicked = 2;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(2, 1fr)";
    this.resizeFonts();
    x.style.width = 100+ "%";
  }
  cameraGridMultiple(){
    this.pagenumber = 1;
    this.gridClicked = 3;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(3, 1fr)";
    this.resizeFonts();
    x.style.width = 100+ "%";
  }
  adjustGrid(){
    var x = window.innerWidth;
    var y = this.gridCont.nativeElement;
    if(x < 426){ y.style.gridTemplateColumns = "repeat(1, 1fr)";  this.gridClicked = 1; };
    if(x < 1023 && x>426){ y.style.gridTemplateColumns = "repeat(2, 1fr)"; this.gridClicked = 2;}
    if(x > 1023){ y.style.gridTemplateColumns = "repeat(3, 1fr)"; this.gridClicked = 3;}
  }
  resizeFonts(){
    // var a = this.camerabox.nativeElement;
    // console.log(a.offsetWidth)
    // if(a.offsetWidth < 350){
    //   var y =this.cameraName.nativeElement;
    //   y.style.fontSize= "15px";
    //   var z = this.status.nativeElement
    //   z.style.fontSize = "8px";
    // }
    // if(a.offsetWidth >350 && a.offsetWidth<730){
    //   var y =this.cameraName.nativeElement;
    //   y.style.fontSize= "25px";
    //   var z = this.status.nativeElement
    //   z.style.fontSize = "15px";
    // }
    // if(a.offsetWidth >730){
    //   var y =this.cameraName.nativeElement;
    //   y.style.fontSize= "35px";
    //   var z = this.status.nativeElement
    //   z.style.fontSize = "20px";
    // }
  }
  cameraIdClicked(cam:any){
    this.pagenumber = 1;
    this.gridClicked = 1;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(1, 1fr)";
    this.resizeFonts();
    x.style.width = 70+ "%";
    this.paginatedCameraList = [cam];
  }
  // for pagination
  pagenumber=1;
  nextPage(){
    var x = Number(this.cameras.length);
    var y = Number(this.pagenumber);
    var z = Number(this.gridClicked*this.gridClicked);
    var a = Math.ceil(x/z);
    if(this.pagenumber != a){
      this.pagenumber = this.pagenumber+=1;
    }
    this.pagination()
  }
  previousPage(){
    if(this.pagenumber != 1){
     this.pagenumber = this.pagenumber-=1 ;
    }
    this.pagination()
  }
  paginatedCameraList: any;
  selectNumbers: any;
  // to populate dropdown options
  selector(){
    var x = Number(this.cameras.length);
    var y = Number(this.pagenumber);
    var z = Number(this.gridClicked*this.gridClicked);
    var a = Math.ceil(x/z);
    this.selectNumbers = new Array(a).fill(0).map((x,i)=>i+1); // [1,2,3,4,...,100]
  }
  pagination(){
    this.selector();
    var cameras = this.cameras
    var x;
    var y = Number(this.pagenumber)
    if(this.gridClicked == 1){
      x = y-=1
      var z =x*1;
      var a = z+1;
      const slicedArray = cameras.slice(z, a);
      this.paginatedCameraList = slicedArray;
    }
    if(this.gridClicked == 2){
      x = y-=1
      var z =x*4;
      var a = z+4;
      const slicedArray = cameras.slice(z, a);
      this.paginatedCameraList = slicedArray;
    }
    if(this.gridClicked == 3){
      x = y-=1
      var z =x*9;
      var a = z+9;
      const slicedArray = cameras.slice(z,a);
      this.paginatedCameraList = slicedArray;
    }
  }



}

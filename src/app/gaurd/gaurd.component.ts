import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';


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
  sitedata = true;

  // rtsp://admin:xx2317xx2317@10.0.2.242:559/cam/realmonitor?channel=6&subtype=1 
  constructor(
    private apiService:ApiService, 
    private changeDetection: ChangeDetectorRef, 
    private storageService:StorageService
    ) { }

  ngOnInit(): void {
    // document.body.style.backgroundImage= "linear-gradient(325deg, rgba(0, 7, 39, 0.9) 18%, rgba(29, 0, 0, 0.9) 66%), url('../../assets/background.jpg'))";
    document.body.style.backgroundImage= "linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%), url('../../assets/background.jpg'))";
    if(this.apiService.sessionstatus() == false){
      this.storageService.deleteStoredEncrData('savedcams')
    }
    this.getSitename();
  }
  @ViewChildren("vjs") vjs: QueryList<any>;
  checkError:any;
  ngAfterViewInit(){
    this.adjustGrid();
    this.changeDetection.detectChanges();
    setTimeout(()=>{
      this.checkError =  setInterval(()=>{ 
         this.vjs.forEach(el => {
          var errorpop = (el.player.error_);
           let app_vjs_player = el.target.nativeElement.parentNode.parentNode
           let snapshotimg = el.target.nativeElement.parentNode.parentNode.nextElementSibling;
           if(errorpop != null){
             app_vjs_player.style.display = "none";
             snapshotimg.style.display = "block";
             var width = (snapshotimg.offsetWidth );
             snapshotimg.style.height = (width* 0.687)+"px";
           }
         }); 
       }, 1000);
    }, 1000);
  }
  ngOnDestroy(){
    if(this.checkError) {clearInterval(this.checkError);}
  }

  removeDuplicateSites(){
    var names_array_new =this.sites.siteList.reduceRight(function (r:any, a:any) {
      r.some(function (b:any) { return a.siteid === b.siteid; }) || r.push(a);
      return r;
    }, []);
    this.sites.siteList = names_array_new.reverse();
  }
  // for sites and data of cameras
  getSitename(){
    this.showLoader = true;
    this.apiService.getSites().subscribe((res:any) => {
      if(res?.Status == "Failed"){
      //  if(res.Message == "Insufficient details"){}
        if(res.Message == "Data not available"){ this.sitedata = false; this.showLoader = false;}
        if(res.Message == "Insufficient details"){this.apiService.onHTTPerror({status:404})}
        if(res.Message == "Invalid user details"){
          this.apiService.refresh();
        setTimeout(()=>{
          this.getSitename();
        },2000) 
       }
      }else{
        this.storageService.storeEncrData('selectedsite', res);
        this.storageService.storeEncrData('siteidfromgaurdpage', res.siteList[0]);
        this.sites = res;
        var sitelist = this.sites.siteList
        const sortAlphaNum = (a:any, b:any) => a.sitename.localeCompare(b.sitename, 'en', { numeric: true })
        sitelist = this.sites.siteList.sort(sortAlphaNum)
        this.sites.siteList = sitelist;
        this.removeDuplicateSites();
        if(this.sites.siteList.length>0){   
          var x  = this.storageService.getEncrData('savedcams');
          if(x != null){this.firstLocalHitforCamdata()}else{this.firstAPiHitforCamdata()} // get camdata
        }else{this.cameras = null; this.showLoader = false}
      }
    },(error)=>{
      this.showLoader =false;
      // console.log(error, 'sitelist')
      if(error){
        if(error.ok== false){
          this.apiService.onHTTPerror(error);
        }
      }
    })
  }
  firstLocalHitforCamdata(){
    var x:any = this.storageService.getEncrData('savedcams');
    this.currentsite = x[0].siteid;
    this.cameras = x[0].data;
    this.apiService.getServices(this.currentsite);
    this.commoncommands();
    setTimeout(() => {
      this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
      if(this.cameras.length >0){this.optionlabel.nativeElement.click();}
    }, 1000);
  }
  firstAPiHitforCamdata(){ 
    this.apiService.getCameras(this.sites.siteList[0].siteid).subscribe((res:any)=>{

      if(res.Status == "Failed"){
        if(res.Message == "Invalid accessToken"){this.apiService.refresh(); setTimeout(()=>{this.savecams()},1000)}
        if(res.Message == "Sorry no cameras found. Try again later."){this.cameras = [], this.showLoader = false; this.savecams();}
      }
      if(res.Status == "Success"){
        this.currentsite = this.sites.siteList[0].siteid;
        this.cameras = res.CameraList;
        this.commoncommands();
        this.savecams();
        this.apiService.getServices(this.currentsite);
        const sortAlphaNum = (a:any, b:any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true })
        this.cameras = this.cameras.sort(sortAlphaNum)
        setTimeout(() => {
          this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
          if(this.cameras.length >0){this.optionlabel.nativeElement.click();}
        }, 1000);
      }
    },(error)=>{
      if(error){
        if(error.ok== false){
          // console.log(error, 'camlist')
          this.apiService.onHTTPerror(error);
        }
      }
    })
  }
  savedcams:any[]=[]
  async savecams(){
    const a: { siteid: any; data: any; }[] = [];
   this.savedcams.push({siteid : this.currentsite,data : this.cameras});
   this.storageService.storeEncrData('savedcams', this.savedcams)
    this.sites.siteList.forEach((el:any) => {
      if(el.siteid != this.currentsite){   
        this.apiService.getCameras(el.siteid).subscribe((res:any)=>{
          if(res.Status == "Success" || res.Message == "Sorry no cameras found. Try again later."){
            if(res.Message == "Sorry no cameras found. Try again later."){this.savedcams.push({siteid : el.siteid, data : []});}
            else{  
              const sortAlphaNum = (a:any, b:any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true })
              var sortedcamdata = res.CameraList.sort(sortAlphaNum)
              var d ={siteid : el.siteid, data : sortedcamdata}
              this.savedcams.push(d);
            }
            this.storageService.storeEncrData('savedcams', this.savedcams)
          }
          if(res.Status == "Failed"){
            if(res.Message == "Invalid accessToken"){this.apiService.refresh(); setTimeout(()=>{this.savecams()},1000)}
          }
          },(error)=>{
          if(error.ok== false){
            // this.alertService.warning('Session Expired');
            this.apiService.onHTTPerror(error);
          }
          // console.log("Something went wrong");
        }
        ); 
      }    
    });  
  }
  
  showcams=true;
  currentsite:any; // to save currentsite
  getCameras(event:any, site:any, index:any){
    this.storageService.storeEncrData('siteidfromgaurdpage', site);
    if(site.siteid != this.currentsite){ this.apiService.getServices(site.siteid); }
      this.pagenumber = 1;
      this.adjustGrid();
      this.viewPanelData = site;
      var siteid = site.siteid;
      this.storageService.storeEncrData('siteidfromgaurdpage', site)
      if(siteid != this.currentsite){
        var x:any = this.storageService.getEncrData('savedcams');
        if(x){
          x.forEach((el:any) => {
            if(el.siteid == site.siteid){ this.cameras = el.data, this.currentsite = el.siteid}
          });
          this.commoncommands();
          if(event.target.nextElementSibling == null){
            this.showcams=false 
          }
          else{
            var xl = event.target.nextElementSibling.style.maxHeight
            if(xl){this.showcams=false}else{ this.showcams=true}
            if(this.cameras.length != 0){setTimeout(()=>{
              if(this.cameras.length>0){this.toggleAccordian(event, index);}
            },200)}
          }
        }else{
          this.cameras = null;
          this.paginatedCameraList = null;
          this.changeDetection.detectChanges();
          this.loadCameraList(event, site, index);
        }
      }else{
        var x = event.target.nextElementSibling.style.maxHeight
        if(x){this.showcams=false}else{ this.showcams=true}
        if(this.cameras.length>0){this.toggleAccordian(event, index);}
      } 
  }
  commoncommands(){
    this.showLoader = false;
    this.pagination();
    this.changeDetection.detectChanges();
  }
  loadCameraList(event:any, site:any, index:any){
    this.storageService.storeEncrData('siteidfromgaurdpage', site);
    var siteid = site.siteid;
    this.currentsite = siteid;
    this.apiService.getCameras(siteid).subscribe((res:any)=>{
      if(res.Status == "Failed"){
        if(res.Message == "Invalid accessToken"){this.apiService.refresh(); setTimeout(()=>{this.savecams()},1000)}
        if(res.Message == "Sorry no cameras found. Try again later."){this.cameras = []}
      }
      if(res.Status == "Success"){
        this.cameras = res.CameraList;
        const sortAlphaNum = (a:any, b:any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true })
        this.cameras = this.cameras.sort(sortAlphaNum)
        this.commoncommands();
        if(this.cameras.length>0){this.toggleAccordian(event, index);}
      }
    },(error)=>{
      // console.log(error, 'camlist')
      if(error.ok== false){
        // this.alertService.warning('Session Expired');
        this.apiService.onHTTPerror(error);
      }
      // console.log("Something went wrong");
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
  cameraGridSettings(gridcount:any){
    this.pagenumber = 1;
    this.gridClicked = gridcount;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = `repeat(${gridcount}, 1fr)`;
    if(gridcount == 1){
      x.style.paddingRight = 30+ "%";
    }else{
      x.style.paddingRight = 0+ "%";
    }
  }
  adjustGrid(){ // determination of grid on based of load display
    var x = window.innerWidth;
    var y;
    if(x < 426){ y=1 };
    if(x < 1023 && x>426){ y=2 }
    if(x > 1023 && x<1800){ y=3 }
    if(x > 1800){ y=4 }
    this.gridCont.nativeElement.style.gridTemplateColumns=`repeat(${y}, 1fr)`;
    this.gridClicked = y; 
    var a = this.gridCont.nativeElement;
    a.style.gridTemplateColumns = `repeat(${this.gridClicked}, 1fr)`;
    if(this.gridClicked == 1){
      a.style.paddingRight = 30+ "%";
    }else{
      a.style.paddingRight = 0+ "%";
    }
  }
  cameraIdClicked(cam:any){
    this.pagenumber = 1;
    this.gridClicked = 1;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(1, 1fr)";
    x.style.paddingRight = 30+ "%";
    this.paginatedCameraList = [cam];
    this.closemodal();
  }
  // for pagination
  pagenumber=1;
  nextPage(){
    var x = Number(this.cameras.length);
    var y = Number(this.pagenumber);
    var z = Number(this.gridClicked*this.gridClicked);
    var a = Math.ceil(x/z);
    var p =(Number(this.pagenumber))
    if(this.pagenumber != a){
      this.pagenumber = p+=1;
      this.pagination()
    }
  }
  previousPage(){
    var p =(Number(this.pagenumber))
    if(this.pagenumber != 1){
     this.pagenumber = p-=1 ;
    }
    this.pagination()
  }
  paginatedCameraList: any;
  selectNumbers: any|[];
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
    var cameras = this.cameras;
    var x;
    var y = Number(this.pagenumber)
    var gc= this.gridClicked;  
    x = y-=1
    var z =x*(gc*gc);
    var a = z+(gc*gc);
    const slicedArray = cameras.slice(z,a);
    this.paginatedCameraList = slicedArray;
    if(this.cameras.length == 1){
      this.gridClicked = 1
    }
  }

  // on search events hide dislay irrelevent
  onInput(e:any){
    this.showcams =false;
    var x = e.target.value;
    var items = this.sites.siteList
    this.adjustGrid();
    var a:any[] = items.filter((item:any) => JSON.stringify(item).toLowerCase().indexOf(x.toLowerCase()) !== -1);
    if(a.length == 0){ this.showcams = false}
    if(a.length > 0){
      if(a[0].siteid != this.currentsite){
    
      var x:any = this.storageService.getEncrData('savedcams');
        x.forEach((el:any) => {
          if(el.siteid == a[0].siteid){ this.cameras = el.data; this.currentsite = el.siteid;this.apiService.getServices(el.siteid); }
        });
        setTimeout(() => {
          if(a.length!=0){
          this.commoncommands();
          if(this.cameras.length >0){this.optionlabel.nativeElement.click();}
          // this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
          }
        }, 1000);
      }else{
        this.showcams =true;
        if(a.length==0){this.showcams = false}
      }
    }
  }



  showOptions(){return this.apiService.showOptions()}
  showOptions1(){return this.apiService.showOptions1()}
  closemodal(){return this.apiService.closemodal();}
  toQRmodal(){return this.apiService.toQR()}

  refresh1(e:any, timeout:any) {
    var img = e.target;
        // console.log(img)
      setTimeout(function() {
          var d = new Date;
          var http = img.src;
          if (http.indexOf("&d=") != -1) {
              http = http.split("&d=")[0];
          }
          img.src = http + '&d=' + d.getTime();
          // console.warn(d.getTime())
      }, timeout);
  }

}

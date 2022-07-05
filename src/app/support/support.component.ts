import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  @ViewChild('catlabel') catlabel: ElementRef;
  @ViewChild('subcatlabel') subcatlabel: ElementRef;
  @ViewChild('statuslabel') statuslabel: ElementRef;
  @ViewChild('sitelabel') sitelabel: ElementRef;


  parentElement:any;
  childElement:any;
  childAcrdHeight:any;
  childAccordion:any;
  childAcrdElement:any;
  faq=false;
  contactUs = false;
  support=true;
  placeholder = "Data is not available";
  site:any;

  constructor(
    private apiservice:ApiService,
     private alertService:AlertService,
     private storageService:StorageService,
     private cdr: ChangeDetectorRef
     ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.site = this.storageService.getEncrData('siteidfromgaurdpage');
    this.getHelpDeskRequests();
    this.gethelpDeskCategories();
    let x = (new Date(Date.now()).getFullYear());
    let y = (new Date(Date.now()).getMonth() + 1);
    let z = (new Date(Date.now()).getDate());
    this.maxDate = {year: x, month: y, day: z};
  }

  pagenumber=1;
  paginatesize = 10;
  nextPage(){
    var x = Number(this.requests.length);
    var a = Math.ceil(x/this.paginatesize);
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
  paginatedRequestList: any;
  selectNumbers: any|[];
  // to populate dropdown options
  selector(){
    var x = Number(this.requests.length);
    var y = Number(this.pagenumber);
    var a = Math.ceil(x/this.paginatesize);
    this.selectNumbers = new Array(a).fill(0).map((x,i)=>i+1); // [1,2,3,4,...,100]
  }
  pagination(){
    this.selector();
    var requests = this.filtereddata.sort((a:any, b:any) => (a.serviceId < b.serviceId ? 1 : -1));
    var x;
    var y = Number(this.pagenumber)
    x = y-=1
    var z =x*this.paginatesize
    var a = z+ this.paginatesize
    const slicedArray = requests.slice(z,a);
    this.paginatedRequestList = slicedArray;
  }

  requests:any=[];
  categories:any=[];
  subcategories:any=[];
  totalsites:any=[];
  status:any=[];
  minstartdate:any = {year: 2014, month: 1, day: 1};
  getHelpDeskRequests(){
    this.showLoader=true;
    this.placeholder = "Loading..."
    this.cdr.detectChanges();
    this.apiservice.getHelpDeskRequests().subscribe((res:any)=>{
      this.showLoader=false;
      // console.log(res)
      if(res.Status == "Success"){
        this.requests = res?.helpDeskList;
        if(res.helpDeskList.length==0){this.placeholder = "There are no available request"}
        this.requests = (this.requests.filter(function(e:any) { return e.status !== 'Deleted' })).reverse();
        const a = res?.helpDeskList.filter(function(e:any) { return e.status !== 'Deleted' });
        // var b = a.splice(a.findIndex((e:any) => e.status === "Deleted"),1);
        this.filtereddata = a;
        this.getfilterdata(a);
        this.pagination();
         if(a.length == 0){
          this.placeholder = "There are no requests for this site."
        }else{
          let minDate = new Date(
            Math.min(
              ...a.map((element:any) => {
                return new Date(element.createdTime);
              }),
            ),
          );
          if(minDate){
            var pipe = new DatePipe('en-us');
            let dateparts:any = pipe.transform(new Date(minDate), 'dd/MM/yyyy')?.split("/");
            this.minstartdate ={year: dateparts[2], month: dateparts[1], day: dateparts[0]}
            // console.log(this.minstartdate)
          }
        }
      }else if(res.Status == 'Failed' && res.Message == 'Invalid user details'){
        this.apiservice.refresh();
      }else{
        this.requests = [];
        this.placeholder = "There are no requests for this site."
        this.cdr.detectChanges();
      }
    })
  }

  currentsubcategory:any;
  currentcategory:any;
  getfilterdata(a:any){

    const cde = Array.from(a.reduce((m:any, 
      {serviceCategoryName}:{serviceCategoryName:any} ) => m.set(serviceCategoryName, (m.get(serviceCategoryName) || 0)), 
      new Map), ([serviceCategoryName]) => ({serviceCategoryName}));
      cde.forEach(el => {this.categories.push(el.serviceCategoryName)});
      this.categories = [...new Set(this.categories)];

    const efg = Array.from(a.reduce((m:any, 
      {serviceSubCategoryName}:{serviceSubCategoryName:any} ) => m.set(serviceSubCategoryName, (m.get(serviceSubCategoryName) || 0)), 
      new Map), ([serviceSubCategoryName]) => ({serviceSubCategoryName}));
      efg.forEach(el1 => {this.subcategories.push(el1.serviceSubCategoryName)});
      this.subcategories = [...new Set(this.subcategories)];

    const hij = Array.from(a.reduce((m:any, 
      {status}:{status:any} ) => m.set(status, (m.get(status) || 0)), 
      new Map), ([status]) => ({status}));
      hij.forEach(el1 => {this.status.push(el1.status)}); 
      this.status = [...new Set(this.status)];

    const klm = Array.from(a.reduce((m:any, 
      {accountShortName}:{accountShortName:any} ) => m.set(accountShortName, (m.get(accountShortName) || 0)), 
      new Map), ([accountShortName]) => ({accountShortName}));
      klm.forEach(el1 => {this.totalsites.push(el1.accountShortName)});
    this.totalsites = [...new Set(this.totalsites)];
    this.totalsites = (this.totalsites.filter( (el:any)=> {return el != null;}))
    
  }

  selectedsite:any;
  selectedCategory:any;
  selectedSubcategory:any;
  selectedStatus:any;
  filtereddata:any=[];
  netfilter(type:any){
    var abc:any;
    if(type=='site'){
      this.sitelabel.nativeElement.click();
      this.categories = [];
      this.subcategories = [];
      this.status=[];
      this.selectedCategory = null;
      this.selectedSubcategory = null;
      abc = this.requests.filter((e:any)=> { return e.accountShortName == this.selectedsite });
      const efg = Array.from(abc.reduce((m:any, 
        {serviceCategoryName}:{serviceCategoryName:any} ) => m.set(serviceCategoryName, (m.get(serviceCategoryName) || 0)), 
        new Map), ([serviceCategoryName]) => ({serviceCategoryName}));
        efg.forEach(el1 => {this.categories.push(el1.serviceCategoryName)});
    }
    if(type=='category'){
      this.subcategories = [];
      this.status=[];
      this.selectedSubcategory = null;
      this.catlabel.nativeElement.click();
      abc = this.requests.filter((e:any)=> { return e.serviceCategoryName == this.selectedCategory });
      const efg = Array.from(abc.reduce((m:any, 
        {serviceSubCategoryName}:{serviceSubCategoryName:any} ) => m.set(serviceSubCategoryName, (m.get(serviceSubCategoryName) || 0)), 
        new Map), ([serviceSubCategoryName]) => ({serviceSubCategoryName}));
        efg.forEach(el1 => {this.subcategories.push(el1.serviceSubCategoryName)});
    }
    if(type=='subcategory'){this.subcatlabel.nativeElement.click();}
    if(type=='status'){this.statuslabel.nativeElement.click();}
    // console.log(this.selectedCategory, this.selectedSubcategory, this.selectedStatus);
    // if(this.selectedCategory){
    //   this.requests = (this.requests.filter(function(e:any) { return e.status !== 'Deleted' }))
    // }
    this.pagination();
  }
  applysearchfilters(){
    // console.log(this.selectedsite,this.selectedCategory,this.selectedSubcategory,this.selectedStatus,this.startDate, this.endDate)
    var sitefilter;
    var catfilter;
    var subcatfilter;
    var datefilter;
    var rawdata;
    rawdata= (this.requests.filter(function(e:any) { return e.status !== 'Deleted' })).reverse();
    // console.log(rawdata)
    if(this.selectedsite){sitefilter = rawdata.filter((el:any) => { return el.accountShortName === this.selectedsite })  }
    else{sitefilter = rawdata}
    // console.log(sitefilter)
    if(this.selectedCategory){catfilter = sitefilter.filter((el:any) => { return el.serviceCategoryName === this.selectedCategory })}
    else{catfilter = sitefilter}
    // console.log(catfilter)
    if(this.selectedSubcategory){subcatfilter = catfilter.filter((el:any) => { return el.serviceSubCategoryName === this.selectedSubcategory })}
    else{subcatfilter = catfilter}
    // console.log(subcatfilter)
    if(this.startDate){
      var startDate = new Date(this.displaYstartDate);
      var endDate = new Date(this.displaYendDate);
      if(endDate.toString() == "Invalid Date"){endDate = new Date(this.displaYstartDate); endDate.setDate(endDate.getDate() + 1); }
      else{endDate.setDate(endDate.getDate() + 1);}
      var datefilter = subcatfilter.filter((a:any)=>{
        var aDate = new Date(a.createdTime);
        startDate; endDate; aDate;
        return aDate <= endDate && aDate >= startDate ;
      })
    }else{datefilter = subcatfilter}
    // console.log(datefilter)  
    this.filtereddata = datefilter;
    if(this.filtereddata.length == 0){this.placeholder = "There are no requests for selected search parameters."}
    this.pagenumber=1;
    this.pagination();
    this.show= !this.show;
  }
  clearsearchfilters(){
    (this.selectedsite = null,this.selectedCategory=null,this.selectedSubcategory=null,this.selectedStatus=null,this.startDate=null,this.endDate=null)
    this.displaYstartDate=null;
    this.displaYendDate = null;
    this.filtereddata = (this.requests.filter(function(e:any) { return e.status !== 'Deleted' })).reverse();
    this.pagination();
    this.show= !this.show;
  }
  
  filter(){
    var abc:any =[];
    if(this.selectedCategory == "Other")
    abc = this.requests.filter((e:any)=> { return e.serviceCategoryName == this.selectedCategory });
  }
  startDate:any;
  endDate:any;
  displaYstartDate:any;
  displaYendDate:any;
  maxDate:any;
  minenddate:any;

  onDateSelect(event:any,select:any){
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    // console.log(select)
    if(x<10){a = '0' + x;} else{ a = x };
    if(y<10){b = '0' + y;} else { b = y };
    if(select == 'end'){this.endDate = a+'/'+b+'/'+ event.year; this.displaYendDate=b+'/'+a+'/'+ event.year};
    if(select == 'start'){this.startDate = a+'/'+b+'/'+ event.year; this.displaYstartDate=b+'/'+a+'/'+ event.year;
    this.minenddate={year: event.year, month: event.month, day: event.day};};
  }

  openfaq(){
    this.faq=true;this.contactUs = false;this.support=false;this.closemodal();
  }
  openContactUs(){
      this.faq=false;this.contactUs = true;this.support=false;this.closemodal();
  }
  openServiceHelpdesk(){
    this.faq=false;this.contactUs = false;this.support=true;this.closemodal();
  }

  toggleAccordian(event:any, index=0) {
    var element = event.target;
    element.classList.add("active");
    var panel = element.nextElementSibling;
    this.parentElement = panel
    if (panel.style.maxHeight) {
      // panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    // to close the opened child accordion
    if(this.childAcrdHeight >= 0){
     this.childAcrdElement.classList.toggle("active"); 
    }
  }

  toggleAccordian1(event:any, index=0) {
    var element = event.target;
    element.classList.toggle("active");  
    this.childAcrdElement = element; 
    var panel1 = element.nextElementSibling;
    this.childElement = panel1;
    this.childAccordion = panel1;
    if (panel1.style.maxHeight) {
      panel1.style.maxHeight = null;
    } else {
      panel1.style.maxHeight = (panel1.scrollHeight) + "px" ; 
      // to increase maxHeight of parent accordion element on opening child accordion
      this.parentElement.style.maxHeight = (Number(this.parentElement.scrollHeight) + Number(panel1.scrollHeight)) + "px";
    }
    // to save the child accordion height so as to close when parent is closed
    this.childAcrdHeight = panel1.scrollHeight;
  }

  toggleAccordian2(event:any, index=0) {
    var element = event.target;
    element.classList.toggle("active");   
    var panel2 = element.nextElementSibling;
    if (panel2.style.maxHeight) {
      panel2.style.maxHeight = null;
    } else {
      panel2.style.maxHeight = panel2.scrollHeight + "px";
      this.childElement.style.maxHeight = (Number(this.childElement.scrollHeight) + Number(panel2.scrollHeight)) + "px";
      this.parentElement.style.maxHeight = (Number(this.parentElement.scrollHeight) + Number(this.childElement.scrollHeight) + Number(panel2.scrollHeight)) + "px";
    }
  }

  message:string;
  bodyContent(e:any){
    this.message = (e.target.value)
  }
  showLoader = false;
  submitIssue(){
    this.showLoader = true;
    let body = this.message;
    let subject = "Support Request"
    this.apiservice.sendEmail(body, subject).subscribe((res:any)=>{
      this.showLoader = false;
      this.alertService.success("Success","Request Sent Successfully")
    },(error)=>{
      this.showLoader=false;
      this.alertService.warning("Error","Something went wrong. Please try again later.")
    })
  }

  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}
  togglePanel(event:any) {return this.apiservice.toggle(event)  }

  toggletickets(event:any, index=0) {
    // console.log(event.target)
    var element = event.target;
    element.classList.add("active");
    var panel = element.nextElementSibling;
    this.parentElement = panel
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    // to close the opened child accordion
    if(this.childAcrdHeight >= 0){
     this.childAcrdElement.classList.toggle("active"); 
    }
  }

  show = false;
  filters() {
    this.show = !this.show;
  }
  showAddSite = false;
  closenow(value:any) {
    this.showAddSite = value;
  }

  requestbean ={
    PrefTimeToCall: '',
    assignedTo: null,
    assignedType: null,
    createdBy: '',
    createdTime: '',
    description: '',
    editedBy: null,
    editedTime: null,
    imagePath: null,
    priority: '',
    reason: null,
    reasonCategory: null,
    remarks: null,
    requestType: '',
    resolution: null,
    serviceCategoryName: '',
    serviceId: '',
    serviceSubCategoryName: '',
    status: '',
    // accountId:''
  }

  visible1=false
  visible2=false
  openModal(){
  }
  openeditmodal(req:any){
    var x = <HTMLElement>document.getElementById('editmodal')
    x.style.display = "block";
    this.requestbean = req;
    // console.log(this.requestbean)
    // console.warn(this.requestbean.PrefTimeToCall)
    // console.warn(this.requestbean.PrefTimeToCall.replace('T', ' '))
  }
  closeEditModal(){
    var x = <HTMLElement>document.getElementById('editmodal')
    x.style.display = "none";
  }
  openviewmodal(req:any){
    var x = <HTMLElement>document.getElementById('viewmodal')
    this.requestbean = req;
    x.style.display = "block";
    // console.log(this.requestbean)
  }
  closeviewModal(){
    var x = <HTMLElement>document.getElementById('viewmodal')
    x.style.display = "none";
  }
  addopen = false;
  openaddmodal(){
    this.requestbean.description = "";
    this.requestbean.remarks = null;
    this.requestbean.PrefTimeToCall = "";
    this.addopen =true;
    var x = <HTMLElement>document.getElementById('addmodal')
    x.style.display = "block";

    var y = <HTMLTextAreaElement>document.getElementById('textareareq');
    var z = <HTMLTextAreaElement>document.getElementById('textareadescr');
    y.value = z.value = ""
  }
  closeAddModal(){
    this.addopen = false;
    var x = <HTMLElement>document.getElementById('addmodal')
    x.style.display = "none";
  }

  opendeletemodal(item:any){
    var x = <HTMLElement>document.getElementById('deletemodal')
    x.style.display = "block";
    this.requestbean = item;
    // console.log(this.requestbean)
  }
  closedeleteModal(){
    var x = <HTMLElement>document.getElementById('deletemodal')
    x.style.display = "none";
  }

  deleteRequest(item:any){
    var id = item.serviceId;
    this.showLoader=true;
    this.apiservice.deleteHelpDeskRequests(id).subscribe((res:any)=>{
      this.showLoader=false;
      this.closedeleteModal();
      this.alertService.success("Information",res.Message);
      this.getHelpDeskRequests();
    })
  }


  @ViewChild('date') date: ElementRef;
  opentimer(){
    var x = <HTMLInputElement>document.getElementById("date");
    // console.log(this.date.nativeElement)
    x.focus();
    x.click();
    this.date.nativeElement
    this.date.nativeElement.focus();
  }
  calldisabled=true
  mindate(){
    var today:any = new Date();
    var dd:any = today.getDate();
    var mm:any = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    var min:any = today.getMinutes();
    let hh:any = today.getHours();
    if(dd<10){dd='0'+dd} 
    if(mm<10){mm='0'+mm} 
    if(min<10){min='0'+min} 
    if(min<50){min+10}
    if(min>50){min = 10; 
      if(hh<11){hh+1}else{hh=1}
    } 
    if(hh<10){hh='0'+hh} 
    // YYYY-MM-DDThh:mm:ss.ms
    today = yyyy+'-'+mm+'-'+dd+'T'+hh+':'+min;
    return today;
  }
  checkbox(e:any){
    if (document.querySelector('#call:checked')) {
      this.calldisabled = false;
    }else{
      this.calldisabled = true;
    }
  }
  prefcall(type:any){
    if(type == 'yes'){this.calldisabled = false}
    if(type == 'no'){this.calldisabled = true}
  }

  submitedit(){
    if(this.requestbean.PrefTimeToCall !=null){
      this.requestbean.PrefTimeToCall= (String(this.requestbean.PrefTimeToCall).replace("T"," "))
      if(this.requestbean.PrefTimeToCall.length == 16 ){
        this.requestbean.PrefTimeToCall = this.requestbean.PrefTimeToCall + ':00'
      }
    }

    this.showLoader=true;
    if(this.requestbean.description !=null && this.requestbean.description != ""){
      this.apiservice.updateHelpDeskRequest(this.requestbean).subscribe((res:any)=>{
        this.showLoader=false;
        this.closeEditModal();
        if(res.Status == "Success"){
          this.getHelpDeskRequests();
          this.alertService.success("Success","Request updated successfully")
        }else{
          this.alertService.success("Failed","Failed to update request please try again later.")
        }
      })
    }else{
      this.showLoader=false;
      this.error = true;
    }

    
  }


  catsforadd:any=[]
  currentaddcat:any=[];
  currentaddsubcat:any;
  currentaddpriority = 'Low';
  showcategories:any;
  showsubcats:any;
  gethelpDeskCategories(){
    this.apiservice.getHelpDeskCategories().subscribe((res:any)=>{
     if(res.Status=="Success"){
      var a = res.CategoryList
      this.catsforadd = (this.unique(a,'catName'))
      this.currentaddcat = this.catsforadd[0];
      this.currentaddsubcat = this.catsforadd[0].subCategoryList[0];

      this.showcategories = this.catsforadd.filter((item:any)=> item.catName !== this.currentaddcat.catName)
      this.showsubcats = this.currentaddcat.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentaddsubcat.serviceSubcatName)
     }else{
      this.catsforadd = []
      this.currentaddcat = [];
      this.currentaddsubcat = [];
     }
    });
  }
  unique(arr:any, key:any) {
    return [...new Map(arr.map((item:any) => [item[key], item])).values()]
  } 
  inputclicked1(e:any){
    var x = (e.target.parentNode);
    this.visible1=!this.visible1;
    this.visible2=false;
  }
  inputclicked2(e:any){
    var x = (e.target.parentNode);
    this.visible2=!this.visible2;
  }
  issueclicked(e:any, cat:any){
    var x = (e.target.parentNode.previousElementSibling);
    // x.style.borderRadius = "8px"
    // this.currentpage = str;
    this.currentaddcat = cat;
    this.visible1 = !this.visible1
    this.currentaddsubcat = this.currentaddcat.subCategoryList[0];
    this.showcategories = this.catsforadd.filter((item:any)=> item.catName !== this.currentaddcat.catName)
    this.showsubcats = this.currentaddcat.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentaddsubcat.serviceSubcatName)
  }
  subcatclicked(e:any, scat:any){
    var x = (e.target.parentNode.previousElementSibling);
    // x.style.borderRadius = "8px"
    // this.currentpage = str;
    this.currentaddsubcat = scat;
    this.visible2 = !this.visible2
    this.showsubcats = this.currentaddcat.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentaddsubcat.serviceSubcatName)

  }
  priorityclicked(e:any, priority:any){
    this.currentaddpriority = priority;
  }
  priorityradio(){
    var x = <HTMLInputElement>document.querySelector('input[name="addpriority"]:checked');
    this.currentaddpriority = x.value;
    // console.log(x.value)
  }
  addtime:any;
  adddescription:any;
  addremark:any;

  addreq(){
    if(this.calldisabled == false && this.addtime == null){
      this.alertService.success('Alert', 'Please select preferred time')
    }else{
      this.addreq1();
    }
  }
  addreq1(){
    this.addopen = false;
    // console.log(this.currentcategory);
    // console.log(this.currentsubcategory);
    if(this.currentaddsubcat == null){
      this.currentaddsubcat = {serviceSubcatName :'Other'}
    }
    this.showLoader =true;
    var site = this.storageService.getEncrData('siteidfromgaurdpage');

    if(!this.addtime){this.addtime = ''}
    else{this.addtime = String(this.addtime).replace("T", " ") + ':00'}
    var payload = {
      siteid:site.siteid, 
      servicename: this.currentaddcat.catName,
      subsevice: this.currentaddsubcat.serviceSubcatName, 
      message: this.adddescription, 
      time: this.addtime,
      priority: this.currentaddpriority,
      remarks: this.addremark
    }
    // console.log(payload)
    if(payload.message!=null && payload.message != ""){
      this.apiservice.addHelpDeskRequest(payload).subscribe((res:any)=>{
        // console.log(res);
        this.closeAddModal();
        this.getHelpDeskRequests();
        setTimeout(()=>{ this.showLoader = false; }, 1000);
        // setTimeout(()=>{this.visibility = false;},5000);
        this.showLoader = false;
        if(res.Status == "Success"){
          this.alertService.success("Success","Thanks for letting us know! We'll be in touch within 24 hours with asistance.")
        }else{
          this.alertService.success("Failed","Failed to add request please try again later.")
        }
      });
    }else{
      this.showLoader=false;
      this.error = true;
      // this.alertService.warning("Warning","Please enter the request")
    }
  }
  error=false;

  @ViewChild ("filter") filtermodal:ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(e:any): void {
    if(this.show){
      if (!this.filtermodal.nativeElement.contains(e.target)) {
        this.show=!this.show
      }else{}
    }
  }

}
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    // var x = document.getElementById('optionlabel2')!;
    // x.click();
    this.site = this.storageService.getEncrData('siteidfromgaurdpage');
    this.getHelpDeskRequests();
  }

  // selectNumbers:any=[];
  // pagenumber:any;
  // pagination(){}
  // previousPage(){}
  // nextPage(){}


  pagenumber=1;
  paginatesize = 8;
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
    var requests = this.requests;
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
  status:any=[];
  getHelpDeskRequests(){
    this.showLoader=true;
    this.placeholder = "Loading..."
    this.cdr.detectChanges();
    this.apiservice.getHelpDeskRequests().subscribe((res:any)=>{
      this.showLoader=false;
      if(res.Status == "Success"){
        this.requests = res?.helpDeskList;
        this.requests = (this.requests.filter(function(e:any) { return e.status !== 'Deleted' }))
        const a = res?.helpDeskList.filter(function(e:any) { return e.status !== 'Deleted' });
        this.pagination();
        // var b = a.splice(a.findIndex((e:any) => e.status === "Deleted"),1);
        this.filtereddata = a;
        this.getfilterdata(a);  
        if(a.length == 0){
          this.placeholder = "There are no requests for this site."
        }
      }else if(res.status == 'Failed' && res.Message == 'Invalid user details'){
        this.apiservice.refresh();
      }else{
        this.requests = [];
        this.placeholder = "There are no requests for this site."
        this.cdr.detectChanges();
      }
    })
  }
  deleteRequest(id:any){
    this.showLoader=true;
    this.apiservice.deleteHelpDeskRequests(id).subscribe((res:any)=>{
      this.showLoader=false;
      this.alertService.success(res.Message);
      this.getHelpDeskRequests();
    })
  }

  getfilterdata(a:any){
    const cde = Array.from(a.reduce((m:any, 
      {serviceCategoryName}:{serviceCategoryName:any} ) => m.set(serviceCategoryName, (m.get(serviceCategoryName) || 0)), 
      new Map), ([serviceCategoryName]) => ({serviceCategoryName}));
      cde.forEach(el => {this.categories.push(el.serviceCategoryName)});

  const efg = Array.from(a.reduce((m:any, 
      {serviceSubCategoryName}:{serviceSubCategoryName:any} ) => m.set(serviceSubCategoryName, (m.get(serviceSubCategoryName) || 0)), 
      new Map), ([serviceSubCategoryName]) => ({serviceSubCategoryName}));
      efg.forEach(el1 => {this.subcategories.push(el1.serviceSubCategoryName)});

  const hij = Array.from(a.reduce((m:any, 
      {status}:{status:any} ) => m.set(status, (m.get(status) || 0)), 
      new Map), ([status]) => ({status}));
      hij.forEach(el1 => {this.status.push(el1.status)});  
  }
  selectedCategory:any;
  selectedSubcategory:any;
  selectedStatus:any;
  filtereddata:any=[];
  netfilter(type:any){
    if(type=='category'){this.catlabel.nativeElement.click();}
    if(type=='subcategory'){this.subcatlabel.nativeElement.click();}
    if(type=='status'){this.statuslabel.nativeElement.click();}
    var nonfiltereddata = this.requests;
    var filtereddata;
    console.log(this.selectedCategory, this.selectedSubcategory, this.selectedStatus);
    if(this.selectedCategory){
      this.requests = (this.requests.filter(function(e:any) { return e.status !== 'Deleted' }))
    }
    this.pagination();
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

  submitIssue1(){
    // console.log("issue submitted")
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
      this.alertService.success("Request Sent Successfully")
    },(error)=>{
      this.showLoader=false;
      this.alertService.warning("Something went wrong. Please try again later.")
    })
  }

  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}
  togglePanel(event:any) {return this.apiservice.toggle(event)  }





  
  toggletickets(event:any, index=0) {
    console.log(event.target)
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
    // console.log("hello")
    this.show = !this.show;
  }

  showAddSite = false;

  closenow(value:any) {
    this.showAddSite = value;
  }


}


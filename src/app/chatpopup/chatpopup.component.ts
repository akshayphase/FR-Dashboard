import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-chatpopup',
  templateUrl: './chatpopup.component.html',
  styleUrls: ['./chatpopup.component.css']
})
export class ChatpopupComponent implements OnInit {

  visibility = false;
  submitted = false;
  showLoader = false;
  selected = false;
  troubleshoot = false;
  feedback = false;
  currentpage= "Home";
  body:string;
  visible= false;

  constructor(private router:Router, private apiService: ApiService, private alertService:AlertService) {
    this.router.events.subscribe((event)=>{
      if ( event instanceof RoutesRecognized ) {
        this.currentpage = (event.state.root.firstChild?.data['routeName']);
      }
    });
  }


  ngOnInit(): void {

  }

  showPopUp(){
    this.visibility = !this.visibility;
    this.selected = false;
    if(this.submitted = true){
      this.submitted = !this.submitted;
    }
  }

  change(e:any){
    this.body = (e.target.value)
  }
  submit(type:any){
    this.showLoader = true;
    var x:string;
    if(type == 'troubleshooting'){ x = "Issue with " + this.currentpage; this.send(x)}
    if(type == 'feedback'){ x = "Feedback Request"; this.send(x)}
  }
  send(subject:string){
    if(this.body != '' && this.body != null && this.body != undefined){
      this.apicall(subject)
    }else{
      this.showLoader=false;
      this.alertService.warning("Please enter the request")
    }
  }
  apicall(subject:string){
    this.apiService.sendEmail(this.body, subject).subscribe((res:any)=>{
      setTimeout(()=>{ this.showLoader = false; this.submitted = !this.submitted;}, 1000);
      setTimeout(()=>{this.visibility = false;},5000)
      this.alertService.success("Thanks for letting us know! We'll be in touch within 24 hours with asistance.")
      // console.log(res) // Status: success
    },(error)=>{
      this.showLoader=false;
      this.alertService.success("Something went wrong. Please try again later.")
    })
  }
  toFeedback(){
   this.selected = true;
   this.feedback = true;
   this.troubleshoot = false;
  }
  toTroubleshoot(){
    this.selected = true;
    this.troubleshoot = true;
    this.feedback = false;
  }
  inputclicked(e:any){
   var x = (e.target.parentNode);
   this.visible = !this.visible
   if(this.visible){x.style.borderRadius = "8px 8px 2px 2px"}
   else{x.style.borderRadius = "8px"}
  }
  issueclicked(e:any, str:string){
    var x = (e.target.parentNode.previousElementSibling);
    x.style.borderRadius = "8px"
    this.currentpage = str;
    this.visible = !this.visible
  }

}

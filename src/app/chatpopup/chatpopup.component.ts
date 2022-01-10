import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';

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

  constructor(private router:Router) {
    router.events.subscribe((event)=>{
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

  submit(){
    this.showLoader = true;
    setTimeout(()=>{ this.showLoader = false; this.submitted = !this.submitted;}, 1000);
    setTimeout(()=>{this.visibility = false;},5000)
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


}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  parentElement:any;
  childElement:any;
  childAcrdHeight:any;
  childAccordion:any;
  childAcrdElement:any;
  faq=true;
  contactUs = false;

  constructor() { }

  ngOnInit(): void {
  }

  openfaq(){
    this.faq=true;
    this.contactUs = false;
  }
  openContactUs(){
      this.faq=false;
      this.contactUs = true;
  }

  submitIssue(){
    // console.log("issue submitted")
  }

  toggleAccordian(event:any, index=0) {
    var element = event.target;
    element.classList.toggle("active");
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


}

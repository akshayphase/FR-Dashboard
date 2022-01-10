import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.datas = [{
      item: "First item",
      info: "Fisrt info"
    },{
      item: "Second item",
      info: "Second info"
    },{
      item: "Third item",
      info: "Third info"
    }];
  }



  datas: any| []
  currentItem: any;
  toggleAccordian(event:any, index:any) {
    var x = this.datas[index].item

 
    var element = event.target;
    element.classList.toggle("active"); 
    this.datas[index].isActive = false; 
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }


  

}

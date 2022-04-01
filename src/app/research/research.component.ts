import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  constructor(private apiservice : ApiService) { }

  ngOnInit(): void {
  }


  
  toggleAccordian(event:any, index=0) {return this.apiservice.toggle(event)}
  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}


}

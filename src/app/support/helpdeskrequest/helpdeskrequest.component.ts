import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-helpdeskrequest',
  templateUrl: './helpdeskrequest.component.html',
  styleUrls: ['./helpdeskrequest.component.css']
})
export class HelpdeskrequestComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
  
  closeAddSite(value:boolean) {
    this.newItemEvent.emit(value);
  }

  constructor() { }

  ngOnInit(): void {
    // console.log(this.show)
  }

}
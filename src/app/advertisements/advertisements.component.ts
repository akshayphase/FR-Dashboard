import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {

  constructor(private apiservice : ApiService, private router:Router) { }

  ngOnInit(): void {
    // this.router.navigateByUrl('/error')
    // document.body.style.backgroundImage= "linear-gradient(325deg, rgba(0, 7, 39, 0.9) 18%, rgba(29, 0, 0, 0.9) 66%), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBt_Zv4413PMLXB3WqQ1827Uv54K8Gu3_lfA&usqp=CAU')"
  }

  toggleAccordian(event:any) {return this.apiservice.toggle(event);}
  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}

}

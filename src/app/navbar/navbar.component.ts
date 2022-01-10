import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/authservice.service';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild("myTopnav", { static: false }) topnav: ElementRef;
  isloggedin: any

  constructor(private router: Router, private authservice: AuthService) { }
  opened= true;
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    var x = this.topnav.nativeElement.children.length - 2;
    (this.topnav.nativeElement.children[x].click());
    (this.topnav.nativeElement.children[x].click());
  }

  burgerIcon() {
    var x = this.topnav.nativeElement;
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  routeTo(url:string){
    this.router.navigateByUrl('/'+url);
    this.burgerIcon();
  }
  clicked() {
    this.opened = false;
    var el = Array.from(document.getElementsByTagName('a') as HTMLCollectionOf<HTMLElement>)
    for (let i = 0; i < el.length; i++) {
      el[0].classList.add("color");
      el[i].addEventListener("click",() => {
        var c = 0;
        while (c < el.length) {el[c++].classList.remove("color");}
        el[i].classList.add("color");
      });
    }
  }

  logout() {
    this.authservice.logout();
  }

}

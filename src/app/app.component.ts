import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  title = 'IVIS_security';

  showHead: boolean = false;
  currentpage = "Home";
  constructor(private router:Router) {
    router.events.subscribe((event)=>{
      if ( event instanceof RoutesRecognized ) {
        this.currentpage = (event.state.root.firstChild?.data['routeName']);
      }
    });
  }

  
  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  //   console.log(event);
  // }


  ngOnInit() {
    this.login1();
  }

  login1(){
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login') {
          this.showHead = false;
        } else {
          // console.log("NU")
          this.showHead = true;
        }
      }
    });
  }
}

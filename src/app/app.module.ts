import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InsightComponent } from './insight/insight.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './services/loader/loader.component';
import { SearchPipe } from './services/searchpipe/search-pipe.pipe';
import { VjsPlayerComponent } from './services/vjs-player/vjs-player.component';
import { ResearchComponent } from './research/research.component';
import { GaurdComponent } from './gaurd/gaurd.component';
import { ChatpopupComponent } from './chatpopup/chatpopup.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { SupportComponent } from './support/support.component';
import { TrendsComponent } from './trends/trends.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './services/alertservice/alert/alert.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SitePipe } from './insight/sitePipe.pipe';
import { SortPipe } from './services/searchpipe/sorting-pipe.pipe';
import { ChartsModule } from 'ng2-charts';
import { ClientServicesComponent } from './client-services/client-services.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { ErrorpageComponent } from './services/errorpage/errorpage.component';

@NgModule({
  declarations: [
    AppComponent,
    InsightComponent,
    NavbarComponent,
    GaurdComponent,
    ResearchComponent,
    TrendsComponent,
    AdvertisementsComponent,
    SupportComponent,
    ChatpopupComponent,
    LoaderComponent,
    SearchPipe,
    SitePipe,
    SortPipe,
    VjsPlayerComponent,
    LoginComponent,
    AlertComponent,
    ClientServicesComponent,
    AdminpanelComponent,
    ErrorpageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbDatepickerModule,
    FormsModule, 
    ChartsModule
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

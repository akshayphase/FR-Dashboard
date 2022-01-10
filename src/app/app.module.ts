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
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';


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
    VjsPlayerComponent,
    LoginComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbDatepickerModule,
    FormsModule      
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { GaurdComponent } from './gaurd/gaurd.component';
import { InsightComponent } from './insight/insight.component';
import { LoginComponent } from './login/login.component';
import { ResearchComponent } from './research/research.component';
import { AuthGuard } from './services/auth.guard';
import { SupportComponent } from './support/support.component';
import { TrendsComponent } from './trends/trends.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', data: {routeName: "Login"},  component: LoginComponent}, 
  { path: 'gaurd', data: {routeName: "Gaurd"}, component: GaurdComponent, canActivate:[AuthGuard] },
  { path: 'insight', data: {routeName: "Insight"}, component: InsightComponent, canActivate:[AuthGuard] },
  { path: 'trends', data: {routeName: "Trends"}, component: TrendsComponent, canActivate:[AuthGuard] },
  { path: 'research', data: {routeName: "Research"}, component: ResearchComponent, canActivate:[AuthGuard] },
  { path: 'advertisement', data: {routeName: "Advertisement"}, component: AdvertisementsComponent, canActivate:[AuthGuard] },
  { path: 'support', data: {routeName: "Support"},  component: SupportComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

import { DashboardService } from '../dashboard/dashboard.service';
import { LogoutComponent } from './logout.component';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
// import { LaddaModule } from 'angular2-ladda';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = [
  { path: '', component: LogoutComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule,
    //  LaddaModule,
      ToasterModule, HttpClientModule,
  ],
  declarations: [
    LogoutComponent
  ],
  providers :[
    DashboardService
  ]
})
export class LogoutModule { }

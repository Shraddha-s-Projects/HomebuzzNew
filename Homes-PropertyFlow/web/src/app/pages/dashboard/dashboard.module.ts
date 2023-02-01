import { DashboardService } from './dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule, ToasterService } from 'angular2-toaster';
// import { LaddaModule } from 'angular2-ladda';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ConfirmDeleteComponent } from '../../../app/modal/confirm-delete/confirm-delete.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng2CompleterModule } from "ng2-completer";
import { AgmCoreModule } from '@agm/core';
import { OpenStreetMapModule } from '../open-street-map/open-street-map.module';
import { HomebuzzEstimatesModule } from '../../../app/modal/homebuzz-estimates/homebuzz-estimates.module';
import { CommonService } from 'src/app/core/services/common.service';

export const ROUTES: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCWVd0v933wxKfFAGtWGWFYKUn65SK2HOQ",
      libraries: ['visualization','places']
    }),
    CommonModule, RouterModule, FormsModule, ReactiveFormsModule, 
    // LaddaModule, 
    ToasterModule, HttpClientModule, 
    ModalModule, Ng2CompleterModule,
    OpenStreetMapModule,
    HomebuzzEstimatesModule
  ],
  declarations: [DashboardComponent, ConfirmDeleteComponent],
  exports:[DashboardComponent],
  providers: [DashboardService, CommonService, ToasterService]
})
export class DashboardModule { }

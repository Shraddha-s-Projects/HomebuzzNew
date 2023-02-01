import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Routes } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { AgmCoreModule } from '@agm/core';
import { Ng2CompleterModule } from 'ng2-completer';
import { GoogleMapComponent } from './google-map.component';

export const ROUTES: Routes = [
  { path: '', component: GoogleMapComponent }
];

@NgModule({
  imports: [
    // RouterModule.forChild(ROUTES),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCWVd0v933wxKfFAGtWGWFYKUn65SK2HOQ",
      libraries: ['visualization', 'places']
    }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    HttpClientModule,
    Ng2CompleterModule
  ],
  declarations: [
    GoogleMapComponent
  ],
  exports: [GoogleMapComponent],
  providers:[
    CommonService,
    CurrencyPipe
  ]
})
export class GoogleMapModule { }

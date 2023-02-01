import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { AgmCoreModule } from '@agm/core';
import { Ng2CompleterModule } from 'ng2-completer';
import { OpenStreetMapComponent } from './open-street-map.component';

export const ROUTES: Routes = [
  { path: '', component: OpenStreetMapComponent }
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
    OpenStreetMapComponent
  ],
  exports: [OpenStreetMapComponent],
  providers:[
    CommonService
  ]
})
export class OpenStreetMapModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule } from 'angular2-toaster';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapTestComponent } from './google-map-test.component';
import { CommonService } from 'src/app/core/services/common.service';



@NgModule({
  declarations: [GoogleMapTestComponent],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      // apiKey: "AIzaSyCWVd0v933wxKfFAGtWGWFYKUn65SK2HOQ",
      apiKey: 'AIzaSyDeZycYkU-eIbFWOeJGOytOW3W49zXAmeo',
      libraries: ['visualization', 'places']
    }),
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    HttpClientModule
  ],
  exports: [GoogleMapTestComponent],
  providers:[
    CommonService
  ]
})
export class GoogleMapTestModule { }

import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { Ng2CompleterModule } from 'ng2-completer';
import { PropertylightFooterComponent } from './propertylight-footer.component';

export const ROUTES: Routes = [
  { path: '', component: PropertylightFooterComponent }
];

@NgModule({
  imports: [
    // RouterModule.forChild(ROUTES),
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    HttpClientModule,
    Ng2CompleterModule
  ],
  declarations: [
    PropertylightFooterComponent
  ],
  exports: [PropertylightFooterComponent],
  providers:[
    CommonService
  ]
})
export class PropertylightFooterModule { }

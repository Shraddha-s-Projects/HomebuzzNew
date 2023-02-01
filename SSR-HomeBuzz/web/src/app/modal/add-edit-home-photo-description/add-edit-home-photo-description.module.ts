import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { AddEditHomePhotoDescriptionComponent } from './add-edit-home-photo-description.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SlideshowModule } from 'ng-simple-slideshow';
import { UploadPhotoDescriptionComponent } from '../upload-photo-description/upload-photo-description.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UploadPhotoDescriptionService } from '../upload-photo-description/upload-photo-description.service';
import { AddEditHomePhotoDescriptionService } from './add-edit-home-photo-description.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatProgressSpinnerModule, MatButtonToggleModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatSliderModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ToasterModule, HttpClientModule, ModalModule, TimepickerModule, BsDatepickerModule.forRoot(), BsDropdownModule.forRoot(), PopoverModule, SlideshowModule, NgImageSliderModule, SlickCarouselModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  declarations: [
    AddEditHomePhotoDescriptionComponent, UploadPhotoDescriptionComponent
  ],
  providers: [
    CommonService, ErrorMessage, UploadPhotoDescriptionService, AddEditHomePhotoDescriptionService
  ],
  exports: [AddEditHomePhotoDescriptionComponent],
  entryComponents: [AddEditHomePhotoDescriptionComponent, UploadPhotoDescriptionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AddEditHomePhotoDescriptionModule { }

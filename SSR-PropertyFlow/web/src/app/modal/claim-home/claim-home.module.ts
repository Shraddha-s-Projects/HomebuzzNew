import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
// import { LaddaModule } from 'angular2-ladda';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatProgressSpinnerModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { ClaimHomeComponent } from './claim-home.component';
import { SearchResultPageService } from '../../../app/pages/search-result-page/search-result-page.service';

@NgModule({
  imports: [
    CommonModule, RouterModule, FormsModule, ReactiveFormsModule, 
    // LaddaModule, 
    ToasterModule, HttpClientModule, ModalModule, TimepickerModule, BsDatepickerModule.forRoot(), BsDropdownModule.forRoot(), PopoverModule, 
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    ClaimHomeComponent
  ],
  providers: [
    CommonService, ErrorMessage, SearchResultPageService
  ],
  exports: [ClaimHomeComponent],
  entryComponents: [ClaimHomeComponent]
})
export class ClaimHomeModule { }

import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgentDashboardComponent } from './agent-dashboard.component';
import { AgentDashboardService } from './agent-dashboard.service';
import { AddEditHomePhotoDescriptionModule } from '../../../../app/modal/add-edit-home-photo-description/add-edit-home-photo-description.module';
import { ClaimHomeModule } from '../../../../app/modal/claim-home/claim-home.module';
import { MatDialogModule, MatButtonModule, MatDatepickerModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { AuthMessageModule } from '../../../../app/modal/auth-message/auth-message.module';
import { PropertyOffersModule } from '../../../../app/modal/agent-modal/property-offers/property-offers.module';
import { CommonService } from '../../../../app/core/services/common.service';
import { TransferOwnershipModule } from '../../../../app/modal/transfer-ownership/transfer-ownership.module';
import { DateRangePickerModule } from '../../../../app/modal/date-range-picker/date-range-picker.module';

export const ROUTES: Routes = [
  { path: '', component: AgentDashboardComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ToasterModule, HttpClientModule, 
    ModalModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    AddEditHomePhotoDescriptionModule,
    ClaimHomeModule,
    AuthMessageModule,
    PropertyOffersModule,
    TransferOwnershipModule,
    DateRangePickerModule
  ],
  declarations: [AgentDashboardComponent],
  exports: [AgentDashboardComponent],
  providers: [AgentDashboardService, CommonService],
  bootstrap: [AgentDashboardComponent],
  entryComponents: []
})
export class AgentDashboardModule { }

import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ResetPasswordService } from './resetpassword.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetpasswordComponent } from './resetpassword.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { AuthMessageModule } from '../../../app/modal/auth-message/auth-message.module';

export const ROUTES: Routes = [
  { path: '', component: ResetpasswordComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule, 
    LaddaModule, 
    ToasterModule, HttpClientModule,
    AuthMessageModule
  ],
  declarations: [
    ResetpasswordComponent
  ],
  providers:[
    ResetPasswordService, CommonService, ToasterService, ErrorMessage
  ]
})
export class ResetpasswordModule { }

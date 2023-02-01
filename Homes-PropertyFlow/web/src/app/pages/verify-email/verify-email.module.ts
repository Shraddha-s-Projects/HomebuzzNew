import { LoginService } from '../login/login.service';
import { ToasterService } from 'angular2-toaster';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { AuthService } from '../../../app/core/services/auth.service';
import { VerifyEmailComponent } from './verify-email.component';
import { VerifyEmailService } from './verify-email.service';
import { AuthMessageModule } from '../../../app/modal/auth-message/auth-message.module';

export const ROUTES: Routes = [
  { path: '', component: VerifyEmailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule,
    LaddaModule,
    ToasterModule, HttpClientModule,
    AuthMessageModule
  ],
  declarations: [VerifyEmailComponent],
  providers: [VerifyEmailService, ToasterService, CommonService, ErrorMessage, LoginService, AuthService]
})
export class VerifyEmailModule { }

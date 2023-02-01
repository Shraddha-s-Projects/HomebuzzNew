import { LoginService } from '../login/login.service';
import { VerifyService } from './verify.service';
import { ToasterService } from 'angular2-toaster';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VerifyComponent } from './verify.component';
import { AuthMessageModule } from '../../../app/modal/auth-message/auth-message.module';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { AuthService } from '../../../app/core/services/auth.service';

export const ROUTES: Routes = [
  { path: '', component: VerifyComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule, 
    LaddaModule, 
    ToasterModule, HttpClientModule, AuthMessageModule
  ],
  declarations: [VerifyComponent],
  providers: [VerifyService, ToasterService, CommonService, ErrorMessage, LoginService, AuthService]
})
export class VerifyModule { }

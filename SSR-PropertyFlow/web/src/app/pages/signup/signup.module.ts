import { ToasterService } from 'angular2-toaster';
import { SignupService } from './signup.service';
import { SignupComponent } from './signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { CommonService } from '../../../app/core/services/common.service';
import { InputTrimModule } from 'ng2-trim-directive';
import { AuthMessageModule } from '../../../app/modal/auth-message/auth-message.module';
export const ROUTES: Routes = [
  { path: '', component: SignupComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule, 
    LaddaModule, 
    ToasterModule, 
    HttpClientModule,InputTrimModule, AuthMessageModule
  ],
  declarations: [
    SignupComponent
  ],
  providers : [
    SignupService, ErrorMessage, CommonService, ToasterService
  ]
})
export class SignupModule { }

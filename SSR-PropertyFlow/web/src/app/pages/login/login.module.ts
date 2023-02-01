import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { SignupService } from '../signup/signup.service';
import { InputTrimModule } from 'ng2-trim-directive';

export const ROUTES: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule, RouterModule, FormsModule,
     LaddaModule, 
     ToasterModule, HttpClientModule,InputTrimModule
  ],
  declarations: [
    LoginComponent
  ],
  providers:[
    LoginService, CommonService, ErrorMessage, SignupService
  ],
})
export class LoginModule { }

import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileService } from './user-profile.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { LaddaModule } from 'angular2-ladda';

export const ROUTES: Routes = [
  { path: '', component: UserProfileComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    LaddaModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    HttpClientModule
  ],
  declarations: [
    UserProfileComponent
  ],
  exports: [UserProfileComponent],
  providers:[
    CommonService, UserProfileService, ErrorMessage
  ]
})
export class UserProfileModule { }

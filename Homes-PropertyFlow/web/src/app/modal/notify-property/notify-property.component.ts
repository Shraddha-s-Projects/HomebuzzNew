import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { UtilityComponent } from '../../../app/core/services/utility';
import { NotifyPropertyService } from './notify-property.service';
import { NotifyProperty } from './notify-property';
import { CommonService } from '../../../app/core/services/common.service';
import { CookieService } from 'ngx-cookie-service';

const EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

@Component({
  selector: 'app-notify-property',
  templateUrl: './notify-property.component.html',
  styleUrls: ['./notify-property.component.css']
})
export class NotifyPropertyComponent implements OnInit {
  public property: any;
  public email: any;
  public isEmailValid: boolean;
  emailFormControl = new FormControl("", [Validators.pattern(EMAIL_REGEX)]);
  PropertyDetailId: number;
  public userCookieName: string = "user";
  public isUserExist: boolean = this.cookieService.check(this.userCookieName);
  public userId: number;
  public isLoaded: boolean;


  public error: any = {
    emailRequired: this.errorMessage.error("RequiredEmail"),
    emailInvalid: this.errorMessage.error("InvalidEmail"),
  };
  constructor(public dialogRef: MatDialogRef<NotifyPropertyComponent>,
    private errorMessage: ErrorMessage,
    private notifyPropertyService: NotifyPropertyService,
    private commonService: CommonService,
    private cookieService: CookieService, ) {
    this.isUserExist ? this.userId = +this.cookieService.get("user") : this.userId = null;
  }

  ngOnInit() {
    if (!this.property) {
      this.notifyPropertyService.getPropertyDetail(this.PropertyDetailId, this.userId).subscribe((data: any) => {
        if (data.Success) {
          this.property = data.Model;
        }
        this.isLoaded = true;
      },
      error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
          if (error.status == 401) {
            this.commonService.toaster("You have not access for notify property module. Please login.", false);
          }
      });
    } else {
      this.isLoaded = true;
    }
    this.email = '';
    this.isEmailValid = false;
  }

  close() {
    this.dialogRef.close(false);
  }

  errorMessageEmail() {
    if (!this.email) {
      this.isEmailValid = false;
      return this.error.emailRequired;
    } else {
      this.isEmailValid = UtilityComponent.validateEmail(this.email);
      return this.error.emailInvalid;
    }

  }

  onSubmitBtnClick() {
    let notifyEmailModal = new NotifyProperty();
    notifyEmailModal.PropertyDetailId = this.PropertyDetailId;
    notifyEmailModal.Email = this.email;
    this.notifyPropertyService.addUpdatePropertyNotify(notifyEmailModal).subscribe((data: any) => {
      if (data.Success && !data.Model.IsUserAlreadyExist) {
        this.commonService.toaster("Notify property successfully.", true);
        this.close();
      }
      else if (data.Success && data.Model.IsUserAlreadyExist) {
        this.commonService.toaster("Email already registered.", false);
      }
      else {
        this.commonService.toaster(this.errorMessage.error('ErrorOccurred'), false);
      }
    },
    error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
    });
  }

}

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { CommonService } from '../../../app/core/services/common.service';
import { UtilityComponent } from '../../../app/core/services/utility';
import { CookieService } from 'ngx-cookie-service';
import { TransferOwnershipVM } from './transfer-ownership';
import { TransferOwnershipService } from './transfer-ownership.service';
import { EventEmitterService } from '../../../app/event-emitter.service';
import { isPlatformBrowser } from '@angular/common';
const EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.css']
})
export class TransferOwnershipComponent implements OnInit {

  public email: any;
  public isEmailValid: boolean;
  emailFormControl = new FormControl("", [Validators.pattern(EMAIL_REGEX)]);
  PropertyDetailId: number;
  PropertyAddress: string;
  public userId: number = +this.cookieService.get("user");
  public isLoading: boolean;
  public isBrowser: boolean;

  public error: any = {
    emailRequired: this.errorMessage.error("RequiredEmail"),
    emailInvalid: this.errorMessage.error("InvalidEmail"),
  };
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public dialogRef: MatDialogRef<TransferOwnershipComponent>,
    private errorMessage: ErrorMessage,
    private commonService: CommonService,
    private cookieService: CookieService,
    private transferOwnershipService: TransferOwnershipService,
    private eventEmitterService: EventEmitterService) {
      this.isBrowser = isPlatformBrowser(platformId);
     }

  ngOnInit() {
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
    let Obj = new TransferOwnershipVM();
    Obj.Email = this.email;
    Obj.FromOwnerId = this.userId;
    Obj.PropertyDetailId = this.PropertyDetailId;
    Obj.Address = this.PropertyAddress;
    this.isLoading = true;
    this.transferOwnershipService.transferPropertyOwnership(Obj).subscribe((data: any) => {
      if (data.Success) {
        this.isLoading = false;
        this.eventEmitterService.onGetPropertyEventEmmit(this.PropertyDetailId, "TransferPropertyOwnership");
        this.commonService.toaster("Transfer to owner successfully.", true);
        this.dialogRef.close(true);
      } else {
        this.isLoading = false;
        this.commonService.toaster(data.ErrorMessage, false);
      }
    },
    error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for transfer ownership property module. Please login.", false);
          this.close();
        }
    });

  }


}

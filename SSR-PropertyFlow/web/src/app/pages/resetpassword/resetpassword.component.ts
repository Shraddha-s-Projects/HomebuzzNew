import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ResetPasswordService } from './resetpassword.service';
import { ToasterService, Toast } from 'angular2-toaster';
import { Router } from '@angular/router';
import { ResetPassword } from './resetpassword';
import { Recaptcha } from '../../../app/core/services/common';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { UtilityComponent } from '../../../app/core/services/utility';
import { AuthMessageComponent } from '../../../app/modal/auth-message/auth-message.component';
import { MatDialog } from '@angular/material';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

declare var popupFunctionObject: any;

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  public resetPassword: ResetPassword;
  public recaptcha: Recaptcha;
  public isLoading: boolean;
  public isEmailExist: boolean = true;
  public isBrowser: boolean;
  error: any = {
    emailRequired: this.errorMessage.error('RequiredEmail'),
    emailInvalid: this.errorMessage.error('InvalidEmail')
  }

  constructor(@Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    private resetPasswordService: ResetPasswordService,
    private commonService: CommonService,
    private toasterService: ToasterService,
    private errorMessage: ErrorMessage,
    private router: Router,
    public dialog: MatDialog) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.resetPassword = new ResetPassword();
    this.recaptcha = new Recaptcha();
  }

  resetAccountPassword() {
    if (!this.resetPassword.IsCapchaVerified) { return false; }
    this.isLoading = true;
    this.resetPasswordService.resetPassword(this.resetPassword).subscribe(
      data => {
        if (data.Success) {
          this.openResetPasswordModal();
        } else {
          this.isEmailExist = true;
          this.isLoading = false;
          this.commonService.toaster(data.ErrorMessage, false);
        }
      },
      error => {
        this.isLoading = false;
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
  }

  @ViewChild('captchaRef2', { static: false }) captchaRef2: ElementRef;
  private _reCaptchaId: number;
  private SITE_ID = '6LempkcUAAAAAKEyaNeC1Yh4vIWhFGPLPolKQp8i';
  ngAfterViewInit() {
    const grecaptcha = (this.window as any).grecaptcha;
    if (grecaptcha) {
      setTimeout(() => {
        this._reCaptchaId = grecaptcha.render(this.captchaRef2.nativeElement, {
          'sitekey': this.SITE_ID,
          'callback': (response) => this.reCapchaSuccess(response),
          'expired-callback': () => this.reCapchaExpired()
        });
      }, 500);
    }
  }

  reCapchaSuccess(data: any) {
    // popupFunctionObject.showLoader();
    if (data) {
      this.recaptcha.response = data;
      this.resetPasswordService.verifyRecaptchaToken(this.recaptcha).subscribe(
        data => {
          this.resetPassword.IsCapchaVerified = data.Model.success == "True" ? true : false;
          // popupFunctionObject.hideLoader();
        },
        error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
        }
      );
    }
    else {
      this.resetPassword.IsCapchaVerified = false;
      // popupFunctionObject.hideLoader();
    }
  }

  reCapchaExpired() {
    this.resetPassword.IsCapchaVerified = false;
  }

  errorMessageEmail() {
    if (!this.resetPassword.Email) {
      this.resetPassword.IsEmailValid = false;
      this.resetPassword.EmailErrorMessage = this.error.emailRequired;
      return false;
    }

    this.resetPassword.IsEmailValid = UtilityComponent.validateEmail(this.resetPassword.Email);
    this.resetPassword.EmailErrorMessage = this.error.emailInvalid;
  }

  closePopUpAndRedirect(url: string) {
    // // popupFunctionObject.closePopUp();
    this.isLoading = false;
    this.router.navigate(['/' + url]);
  }

  openResetPasswordModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "On Its Way!";
    dialogConfirmRef.componentInstance.message =
      "<p class='font-15'>We have sent you a temporary link to reset your password in PropertyFlow!</p>" +
      "<p class='font-15'>Please note that this temporary link will only work for the next 24 hours!</p>" +
      "<p class='font-15'>If you don't see it in a few minutes, please check your spam or clutter folders for an email from PropertyFlow.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";
    dialogConfirmRef.componentInstance.url1 = "login";
    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }
}

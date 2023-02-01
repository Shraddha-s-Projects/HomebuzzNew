import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { loginUser } from '../login/loginUser';
import { ToasterConfig } from 'angular2-toaster';
import { verifyUser } from '../verify/verifyUser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { LoginService } from '../login/login.service';
import { AuthService } from '../../../app/core/services/auth.service';
import { UtilityComponent } from '../../../app/core/services/utility';
import { VerifyEmailService } from './verify-email.service';
import { MatDialog } from '@angular/material';
import { AuthMessageComponent } from '../../../app/modal/auth-message/auth-message.component';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

declare var popupFunctionObject: any;

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  @Input() loginuser: loginUser;
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });
  public sub: any;
  public isLoading: boolean;
  public verifyUser: verifyUser;
  public isBrowser: boolean;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
  @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private errorMessage: ErrorMessage,
    private loginService: LoginService,
    private verifyemailServie: VerifyEmailService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
   }

  ngOnInit() {
    this.verifyUser = new verifyUser();
    this.loginuser = new loginUser();
    this.sub = this.route.params.subscribe(params => {
      this.verifyUser.Hash = params["emailHash"];
      this.verifyUser.VerificationCodeHash = params["codeHash"];
    });

    this.validateVerificationRequest();
  }

  validateVerificationRequest() {
    if (!this.verifyUser.Hash) {
      // this.router.navigate(["/login"]);
      return;
    }

    if (this.verifyUser.VerificationCodeHash) {
      this.verifyUser.IsCodeHashVerified = true;
    }

    // Check it code hash is not empty. User has already verified.
    // User has made request for password reset. Skip this step.
    if (!this.verifyUser.IsCodeHashVerified) {
      // popupFunctionObject.showLoader();
      this.verifyemailServie.isEmailAlreadyVerified(this.verifyUser).subscribe(
        data => {
          this.verifyUser.IsAlreadyVerified = data.Model.IsAlreadyVerified;
          if (this.verifyUser.IsAlreadyVerified) {
            this.openAlreadyValidatedModal();
          }
        },
        error => {
          this.commonService.toaster(this.errorMessage.error("ErrorOccurred"), false);
        },
        () => {
          // popupFunctionObject.hideLoader();
        }
      );
    }
  }

  verifyUserByVerificationCode() {
    if (this.verifyUser.Hash) {
      this.isLoading = true;
      this.verifyemailServie.Verify(this.verifyUser).subscribe(
        data => {
          if (data.Success) {
            this.verifyUser.ResetPasswordLink = data.Model.ResetPasswordLink;
            this.verifyemailServie.SaveVerifyResponse(data);
            this.openValidateSuccessModal();
          } else {
            this.verifyUser = data.Model;
            this.checkVerifyResponse(data);
          }
        },
        error => {
          this.commonService.toaster(this.errorMessage.error("ErrorOccurred"), false);
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }

  checkVerifyResponse(data: any) {
    if (data.Model.IsAlreadyVerified) {
      this.verifyUser.IsAlreadyVerified = true;
      this.openAlreadyValidatedModal();
    }

    if (!data.Model.IsVerificationCodeValid) {
      this.verifyUser.IsVerificationCodeValid = false;
      this.commonService.toaster(data.Model.Message, false);
    }
  }

  closePopUp() {
    // popupFunctionObject.closePopUp();
    this.isLoading = false;
  }

  closePopUpAndRefresh() {
    // popupFunctionObject.closePopUp();
    this.isLoading = false;
  }

  openAlreadyValidatedModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Whoops!";
    dialogConfirmRef.componentInstance.message =
      "<p>It seems provided verification code has already used for verification.</p>" +
      "<p>You can make login into your account.</p>" +
      "<p>If you don't know your password, please click on Reset Password button to create a new password for your account.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "Login";
    dialogConfirmRef.componentInstance.btnText2 = "Reset Password";
    dialogConfirmRef.componentInstance.url1 = "login";
    dialogConfirmRef.componentInstance.url2 = "resetpassword";

    dialogConfirmRef.afterClosed().subscribe(result => {
    })
  }

  openValidateSuccessModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Congratulations!";
    dialogConfirmRef.componentInstance.message =
      "<p class='mb-0'>Your email address has been verified successfully!</p>";
    if (this.verifyUser.ResetPasswordLink == "" || this.verifyUser.ResetPasswordLink == null) {
      dialogConfirmRef.componentInstance.btnText1 = "Login";
      dialogConfirmRef.componentInstance.url1 = "login";
    }
    else {
      this.localStorage.setItem("IsVerify", "true");
      dialogConfirmRef.componentInstance.btnText1 = "Set password";
      dialogConfirmRef.componentInstance.url1 = this.verifyUser.ResetPasswordLink;
    }

    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }

  openInvalidModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Whoops!";
    dialogConfirmRef.componentInstance.message =
      "<p class='mb-0'>E-mail address or Password does not match.</p>" +
      "<p class='mb-0'>Please check the spelling or submit a valid credentials to use for your account in the system.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";

    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }

}

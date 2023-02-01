import { ToasterConfig } from "angular2-toaster";
import { LoginService } from "../login/login.service";
import { verifyUser } from "./verifyUser";
import { CreatePassword } from "./verifyUser";
import { VerifyService } from "./verify.service";
import { Component, OnInit, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Input, Inject } from "@angular/core";
import { loginUser } from "../login/loginUser";
import { CommonService } from "../../../app/core/services/common.service";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { AuthService } from "../../../app/core/services/auth.service";
import { UtilityComponent } from "../../../app/core/services/utility";
import { MatDialog } from "@angular/material";
import { AuthMessageComponent } from "../../../app/modal/auth-message/auth-message.component";
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

declare var popupFunctionObject: any;

@Component({
  selector: "app-verify",
  templateUrl: "./verify.component.html",
  styleUrls: ["./verify.component.css"]
})
export class VerifyComponent implements OnInit {
  //hash : string;
  @Input() loginuser: loginUser;
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });
  public sub: any;
  public isVerified: boolean;
  public isLoading: boolean;
  public password: CreatePassword;
  public verifyUser: verifyUser;
  public isBrowser: boolean;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
  @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private errorMessage: ErrorMessage,
    private loginService: LoginService,
    private verifyServie: VerifyService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    let isVerify = this.localStorage.getItem("IsVerify");
    isVerify ? this.isVerified = true : this.isVerified = false;
    this.localStorage.removeItem("IsVerify");
  }

  ngOnInit() {
    this.password = new CreatePassword();
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
      this.verifyServie.isEmailAlreadyVerified(this.verifyUser).subscribe(
        data => {
          this.verifyUser.IsAlreadyVerified = data.Model.IsAlreadyVerified;
          if (this.verifyUser.IsAlreadyVerified) {
            this.openAlreadyValidatedModal();
            // popupFunctionObject.showPopUp("AlreadyValidatedPopUp");
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
      this.verifyServie.Verify(this.verifyUser).subscribe(
        data => {
          if (data.Success) {
            this.verifyServie.SaveVerifyResponse(data);
            this.isVerified = true;
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

  createNewPassword() {
    if (!this.validatePassword()) {
      this.password.IsPasswordValid = false;
      return false;
    }

    this.password.Hash = this.verifyUser.Hash;
    this.isLoading = true;
    this.loginService.getPasswordHash(this.password.NewPassword).subscribe(data => {
      this.password.NewPassword = data.ErrorMessage;
      this.password.NewPasswordRepeat = this.password.NewPassword;
      this.verifyServie.CreateNewPassword(this.password).subscribe(
        data => {
          //this.commonService.toaster(data.ErrorMessage, data.Success);
          if (!data.Model.IsPasswordValid) {
            this.password.IsPasswordValid = false;
            this.password.IsPasswordMatchRule = false;
            this.password.IsNewPasswordMatch = false;
          } else {
            this.router.navigate(["/login"]);
          }
        },
        error => {
          this.commonService.toaster(this.errorMessage.error("ErrorOccurred"), false);
        },
        () => {
          this.isLoading = false;
        }
      );
    });
  }

  validatePassword() {
    if (!this.isMatchPasswordRule()) this.password.IsPasswordMatchRule = false;
    else this.password.IsPasswordMatchRule = true;

    if (
      this.password.NewPassword &&
      this.password.NewPasswordRepeat &&
      this.password.NewPassword == this.password.NewPasswordRepeat
    )
      this.password.IsNewPasswordMatch = true;
    else this.password.IsNewPasswordMatch = false;

    if (
      !this.password.IsPasswordMatchRule ||
      !this.password.IsNewPasswordMatch ||
      !this.password.NewPassword ||
      !this.password.NewPasswordRepeat
    )
      this.password.IsPasswordValid = false;
    else this.password.IsPasswordValid = true;

    if (this.password.IsPasswordMatchRule && this.password.IsNewPasswordMatch && this.password.IsPasswordValid)
      return true;
    else return false;
  }

  isMatchPasswordRule() {
    return UtilityComponent.validPasswordRule(this.password.NewPassword, this.password.NewPasswordRepeat);
  }

  openAlreadyValidatedModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Whoops!";
    dialogConfirmRef.componentInstance.message =
      "<p>It seems provided verification code has already used for verification.</p>" +
      "<p>You can make login into your account</p>" +
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
      "<p class=''>Your email address has been verified successfully!</p>" +
      "<p class='mb-0'>You can now create a new password to access your account.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";

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
      "<p class=''>E-mail address or Password does not match.</p>" +
      "<p class='mb-0'>Please check the spelling or submit a valid credentials to use for your account in the system.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";

    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }

  openEmailNotVerifiedModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Whoops!";
    dialogConfirmRef.componentInstance.message =
      "<p class=''>E-mail address is not verified.</p>" +
      "<p class='mb-0'>An email has been sent to you to confirm your address and complete the sign up process." +
      "It should be there momentarily!</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";

    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }

  openSomethingWentWrongModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Whoops!";
    dialogConfirmRef.componentInstance.message =
      "<p class=''>Sorry, something went wrong. An unexpected error has occurred.</p>" +
      "<p class='mb-0'> Please refresh the page or try again later.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";

    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }
}

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, PLATFORM_ID } from '@angular/core';
import { signupuserModel } from './signupuserModel';
import { SignupService } from './signup.service';
import { ToasterConfig } from "angular2-toaster";
import { ViewChild, ElementRef, Inject } from '@angular/core';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { CommonService } from '../../../app/core/services/common.service';
import { UtilityComponent } from '../../../app/core/services/utility';
import { PropertyView, IHomeViewerCookie } from '../search-result-page/search-result-page';
import { CookieService } from 'ngx-cookie-service';
import { SearchResultPageService } from '../search-result-page/search-result-page.service';
import { MatDialog } from '@angular/material';
import { AuthMessageComponent } from '../../../app/modal/auth-message/auth-message.component';
import { v4 as uuidv4 } from 'uuid';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare var popupFunctionObject: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('submitButton', { static: false }) submitButton: ElementRef;
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });

  public signupUser: signupuserModel;
  public sub: any;
  public isTermsSelected: boolean = null;
  public isLoading: boolean = false;
  public isEmailValid: boolean = false;
  public isFirstnameValid: boolean;
  public isLastnameValid: boolean;
  public isPasswordValid: boolean;
  public isPasswordTrimmed: boolean;
  public isRepeteEmailMatch: boolean;
  public isValidPassword: boolean;
  public isRepetePasswordMatch: boolean;
  public isUserNameValid: boolean;
  public userNameValidMsg: string;
  public homeViewerCookieName: string = "home_viewer";
  public emailErrorMessage: string;
  public UserKey: any;
  public isBrowser: boolean;
  public error: any = {
    firstName: this.errorMessage.error('RequiredFirstName'),
    lastName: this.errorMessage.error('RequiredLastName'),
    emailRequired: this.errorMessage.error('RequiredEmail'),
    emailInvalid: this.errorMessage.error('InvalidEmail'),
    selectTerms: this.errorMessage.error('SelectTerms'),
    passwordInvalid: this.errorMessage.error('InvalidPassword'),
    repetEmailNotMatch: this.errorMessage.error('RepetEmailNotMatch')
  }

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
  @Inject(PLATFORM_ID) private platformId: Object,
    private signupService: SignupService,
    private errorMessage: ErrorMessage,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private cookieService: CookieService,
    private searchResultPageService: SearchResultPageService,
    public dialog: MatDialog
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.signupUser = new signupuserModel();
    let isExistUserKey = this.cookieService.check("UserKey");
    if (!isExistUserKey) {
      var Id = uuidv4();
      this.addUpdateUserKey(Id);
      this.cookieService.set("UserKey", JSON.stringify(Id),null, null,null,null,null);
    }
    if (this.cookieService.get("UserKey")) {
      this.UserKey = JSON.parse(this.cookieService.get("UserKey"));
    }

    this.checkForInvitationCode();
  }

  addUpdateUserKey(Id) {
    let obj: any = {};
    obj["UserKey"] = Id;
    let isUserCookieExist = this.cookieService.check("user");
    if (isUserCookieExist) {
      obj["UserId"] = +this.cookieService.get("user");
    }
    this.signupService.addUpdateUserKey(obj).subscribe((data: any) => {

    });
  }

  checkForInvitationCode() {
    this.sub = this.route.params.subscribe(params => {
      this.signupUser.inviteCode = params['inviteCode'];
    });

    if (this.signupUser.inviteCode) {
      this.signupService.getEmailByInvitationCode(this.signupUser.inviteCode).subscribe(
        data => {
          if (data.Success) {
            this.signupUser.email = data.ErrorMessage;
            this.errorMessageEmail();
          }
        }
      );
    }
  }

  signup() {
    if (this.isRepetPasswordMatch()) {
      this.submitButton.nativeElement.disabled = true;
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        this.submitButton.nativeElement.disabled = false;
      }, 5000);
      let homeViewerCoockie = this.cookieService.get('home_viewer');
      let homeArr;
      if (this.localStorage.getItem("prop_viewer")) {
        homeArr = JSON.parse(this.localStorage.getItem("prop_viewer"));
      }
      this.signupUser.Homes = [];
      if (homeArr) {
        this.signupUser.Homes = homeArr.Homes;
      }
      if (homeViewerCoockie !== "") {
        var data = JSON.parse(homeViewerCoockie)
        this.signupUser.Coockie = data.Ids;
      }
      this.signupService.signUp(this.signupUser).subscribe(
        data => {
          if (data.Success && data.Model.IsSuccessSignUp) {
            // this.localStorage.setItem('username', data.Model.FirstName);
            this.signupUser.email = data.Model.Email;
            this.signupUser.firstName = data.Model.FirstName;
            this.signupUser.lastName = data.Model.LastName;
            let isCookieExist = this.cookieService.check(this.homeViewerCookieName);
            if (isCookieExist) {
              if (this.cookieService.get(this.homeViewerCookieName)) {
                let propertiesInCookie: IHomeViewerCookie = JSON.parse(this.cookieService.get(this.homeViewerCookieName));
                let ids = propertiesInCookie.Ids.split(',');
                this.savePropertyViewCount(ids, data);
              }
            }
            this.openSignUpSuccessModal();
          }
          else if (data.Success && data.Model.IsUserAlreadyExist) {
            this.openAlreadySignUpModal();
          }
          else if (data.Success && !data.Model.IsEmailValid) {
            this.commonService.toaster(this.errorMessage.error('ErrorOccurred'), false);
          }
          else {
            this.commonService.toaster(this.errorMessage.error('ErrorOccurred'), false);
          }
        },
        error => {
          this.commonService.toaster(this.errorMessage.error('ErrorOccurred'), false);
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }

  savePropertyViewCount(ids: any, data: any) {
    let propertyViewObj = new PropertyView();
    propertyViewObj['PropertyDetailId'] = ids;
    propertyViewObj['UserId'] = data.Model.userId;
    propertyViewObj['ViewDate'] = new Date();
    propertyViewObj['UserKey'] = this.UserKey;
    this.searchResultPageService.savePropertyViewCount(propertyViewObj).subscribe(
      data => {
        if (data.Success) {
        }
      },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }
    );
  }

  errorMessageEmail() {
    if (!this.signupUser.email) {
      this.isEmailValid = false;
      this.emailErrorMessage = this.error.emailRequired;
      return false;
    } else {
      this.isEmailValid = UtilityComponent.validateEmail(this.signupUser.email);
      this.emailErrorMessage = this.error.emailInvalid;
    }
  }

  isStringOnly(str: string) {
    let isStringify = UtilityComponent.isStringOnly(str);
    let isTrimmed = str.trim() ? true : false;
    return isStringify && isTrimmed ? true : false;
  }

  validatePassword(str: string) {
    let trimmedStr = str.trim();
    this.isPasswordTrimmed = trimmedStr && trimmedStr == str ? true : false;
    if (!this.isMatchPasswordRule()) {
      this.signupUser.IsPasswordMatchRule = false;
      this.isValidPassword = false;
      return false;
    }
    else {
      let isMatch: boolean;
      this.signupUser.repeatPassword ? isMatch = this.isRepetPasswordMatch() : false;
      this.signupUser.IsPasswordMatchRule = true;
      this.isValidPassword = true;
    }

  }

  validFirstName() {
    this.isFirstnameValid = this.isStringOnly(this.signupUser.firstName)
  }


  isMatchPasswordRule() {
    return UtilityComponent.validPasswordRule(this.signupUser.password, this.signupUser.password);
  }
  isRepetPasswordMatch() {
    if (!this.signupUser.password || this.signupUser.password != this.signupUser.repeatPassword) {
      this.isRepetePasswordMatch = false; return false;
    }
    else {
      this.isRepetePasswordMatch = true;
      return true;
    }
  }
  validateUsername() {
    var error = "";
    var illegalChars = /\W/; // allow letters, numbers, and underscores

    if (this.signupUser.userName == "") {
      this.userNameValidMsg = "You didn't enter a username.";
      this.isUserNameValid = true;
      return false;

    } else if ((this.signupUser.userName.length < 5) || (this.signupUser.userName.length > 15)) {
      this.userNameValidMsg = "Username minimum length is 5 characters or maximum 15 characters.";
      this.isUserNameValid = true;
      return false;

    } else if (illegalChars.test(this.signupUser.userName)) {
      this.userNameValidMsg = "The username contains illegal characters.";
      this.isUserNameValid = true;
      return false;

    } else if (!this.signupUser.userName.trim()) {
      this.userNameValidMsg = "You are not allowed to add blank space.";
      this.isUserNameValid = true;
      return false;
    } else {
      //fld.style.background = 'White';
      this.isUserNameValid = false;
      this.userNameValidMsg = '';
    }
    return true;
  }

  closePopUp(status: string) {
    status == 'success' ? this.router.navigate(['/login']) : this.isEmailValid = false;
    this.signupUser = new signupuserModel();
    // popupFunctionObject.closePopUp();
  }

  openAlreadySignUpModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Whoops!";
    dialogConfirmRef.componentInstance.message =
      "<p class='font-15'>That email address seems to already be registered with us.</p>" +
      "<p class='mb-0 font-15'>Please check the spelling or submit a new email address to use for your account in the PropertyFlow system.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";

    dialogConfirmRef.afterClosed().subscribe(result => {
      this.isLoading = false;
    })
  }

  openSignUpSuccessModal() {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.title = "Thank you!";
    dialogConfirmRef.componentInstance.message =
      "<p class='font-15'>An email has been sent to you to confirm your address and complete the " +
      "sign up process.</p>" +
      "<p class='mb-0 font-15'>If you don't see it in a few minutes, please check your spam " +
      "folder for an email from PropertyFlow.</p>";
    dialogConfirmRef.componentInstance.btnText1 = "OK - I GOT IT!";
    dialogConfirmRef.componentInstance.url1 = "login";
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


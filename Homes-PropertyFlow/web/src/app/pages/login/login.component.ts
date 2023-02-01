import { Component, OnInit, Input, PLATFORM_ID } from "@angular/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { LoginService } from "./login.service";
import { loginUser } from "./loginUser";
import { Router } from "@angular/router";
import { ErrorStateMatcher } from "@angular/material";
import { ViewChild, ElementRef, Inject } from "@angular/core";
import { ToasterConfig } from "angular2-toaster";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { CommonService } from "../../../app/core/services/common.service";
import { SignupService } from "../signup/signup.service";
import { CookieService } from "ngx-cookie-service";
import { UtilityComponent } from "../../../app/core/services/utility";
import "rxjs/add/operator/map";
import { v4 as uuidv4 } from 'uuid';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

declare var popupFunctionObject: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @Input() loginuser: loginUser;
  @ViewChild("submitButton", { static: false }) submitButton: ElementRef;

  public isCallLocalStorageApi: boolean;
  public saving = false;
  public isFormValid: Boolean = false;
  public VerifiedMessage: string;
  public isLoading: boolean = false;
  public isEmailValid: boolean;
  public propertyViewerCookieName: string = "prop_viewer";
  public UserKey: any;
  public isBrowser: boolean;
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });
  // public propViewerCoockie = new IPropertyViewerCookie();
  public error: any = {
    emailRequired: this.errorMessage.error("RequiredEmail"),
    emailInvalid: this.errorMessage.error("InvalidEmail"),
    password: this.errorMessage.error("RequiredPassword")
  };

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, 
  @Inject(PLATFORM_ID) private platformId: Object,
    private loginService: LoginService,
    private router: Router,
    private errorMessage: ErrorMessage,
    private commonService: CommonService,
    private signupService: SignupService,
    private cookieService: CookieService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
   }

  ngOnInit() {
    this.loginuser = new loginUser();
    let isExistUserKey = this.cookieService.check("UserKey");
    if (!isExistUserKey) {
      var Id = uuidv4();
      // this.addUpdateUserKey(Id);
      this.cookieService.set("UserKey", JSON.stringify(Id), null, null,null,null,null);
    }
    if(this.cookieService.get("UserKey")){
      this.UserKey = JSON.parse(this.cookieService.get("UserKey"));
    }
  }

  addUpdateUserKey(Id) {
    let obj: any = {};
    obj["UserKey"] = Id;
    let isUserCookieExist = this.cookieService.check("user");
    if (isUserCookieExist) {
      obj["UserId"] = +this.cookieService.get("user");
    }
    this.loginService.addUpdateUserKey(obj).subscribe((data: any) => {

    });
  }

  login() {
    this.isLoading = true;
    this.submitButton.nativeElement.disabled = true;
    if (this.loginuser.Username.length > 0 && this.loginuser.Password.length > 0) {
      this.saving = true;

      // setTimeout(() => {
      //   this.isLoading = false;
      //   this.submitButton.nativeElement.disabled = false;
      // }, 5000);

      this.loginService.getPasswordHash(this.loginuser.Password).subscribe(data => {
        if (data.Success) {
          this.loginuser.PasswordHash = data.ErrorMessage;
          let isHomeViewerCoockieExist = this.cookieService.check("home_viewer");
          if(this.localStorage.getItem("prop_viewer")){
            let homeArr = JSON.parse(this.localStorage.getItem("prop_viewer"));
          }
          this.loginuser.Homes = [];
          // if (homeArr) {
          //   homeArr.Homes.forEach(home => {
          //     home.ViewDate = moment(home.ViewDate).format('MM/DD/YYYY');
          //     home.UserKey = this.UserKey;
          //   });
          //   this.loginuser.Homes = homeArr.Homes;
          // }
          if (isHomeViewerCoockieExist) {
            let homeViewerCoockie = this.cookieService.get("home_viewer");
            this.loginuser.coockie = homeViewerCoockie;
            // let propViewerCoockie = this.cookieService.get("prop_viewer");
            // this.loginuser.coockie = propViewerCoockie;
          } else {
            delete this.loginuser.coockie;
          }
          this.loginService.login(this.loginuser).subscribe(
            data => {
              // this.loginService.setLoggedInUser(data);
              // this.loginuser.UserId = +data.model.EncryptedUserId;
              // deb/ugger
              // this.router.navigate(["/dashboard"]);
              // setTimeout(() => {
              // this.router.navigate(["/dashboard"]);
              // }, 1000);
              this.localStorage.setItem("access_token", data.access_token);
              this.localStorage.setItem("userId", data.model.EncryptedUserId);
              this.localStorage.setItem("userame", data.model.UserName);
              this.localStorage.setItem("rolename", data.model.RoleName);
              this.localStorage.setItem("roleId", data.model.RoleId);
              this.cookieService.set("user", data.model.EncryptedUserId, null, null,null,null,null);
              this.cookieService.set("rolename", data.model.RoleName, null, null,null,null,null);
              this.cookieService.set("roleId", data.model.RoleId, null, null,null,null,null);
              this.cookieService.set("isCallLocalStorageApi", "true", null, null,null,null,null);
              this.isLoading = false;
              let isUserCookieExist = this.cookieService.check("user");
              if (isUserCookieExist) {
                if(this.cookieService.get("UserKey")){
                  let Id = JSON.parse(this.cookieService.get("UserKey"));
                  // this.addUpdateUserKey(Id);
                }
              }

              this.router.navigate(["/dashboard"]);
              // if (data.model.PropertyDetailIds.length > 0) {
              //   let PropertyIdString = data.model.PropertyDetailIds.toString();
              //   let homeViewerCoockie = new IHomeViewerCookie();
              //   homeViewerCoockie["Ids"] = PropertyIdString;
              //   this.cookieService.set("home_viewer", JSON.stringify(homeViewerCoockie));
              // }
              // this.cookieService.set("user", data.model.EncryptedUserId);
              // this.cookieService.set("rolename", data.model.RoleName);
              // this.cookieService.set("roleId", data.model.RoleId);
              // if (data.model.PropertyViwer.length > 0) {
              //   let propertyViewerCookie: IPropertyViewerCookie = new IPropertyViewerCookie();
              //    propertyViewerCookie.Homes = [];
              //   data.model.PropertyViwer.forEach(element => {
              //     let home = new IHomeCoockie();
              //     home.Id = element.PropertyDetailId.toString();
              //     home.ViewDate =  moment(element.ViewDate).format('MM/DD/YYYY');
              //     home.UserKey = this.UserKey;
              //     propertyViewerCookie.Homes.push(home);
              //   });
              //   // console.log("propCoockie", JSON.stringify(propertyViewerCookie));
              //   // this.cookieService.set("prop_viewer", JSON.stringify(propertyViewerCookie));
              //   // this.localStorage.setItem("prop_viewer",JSON.stringify(propertyViewerCookie));
              //   this.localStorage.setItem("prop_viewer", JSON.stringify(propertyViewerCookie));
              // }
              // this.cookieService.set("user", data.model.EncryptedUserId);

            },
            error => {
              let errorMessage: string;
              errorMessage =
                error.status === 401 ? "Invalid email or password!" : this.errorMessage.error("ErrorOccurred");
              this.commonService.toaster(errorMessage, false);
              this.saving = false;
              this.isLoading = false;
            },
            () => {
              this.isLoading = false;
            }
          );
        }
      });
    }
  }

  errorMessageEmail() {
    if (!this.loginuser.Username) {
      this.isEmailValid = false;
      return this.error.emailRequired;
    } else {
      this.isEmailValid = UtilityComponent.validateEmail(this.loginuser.Username);
      return this.error.emailInvalid;
    }
  }

  customErrorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl | null, form: FormGroupDirective | NgForm | null) => {
      const isSubmitted = form && form.submitted;

      if (control) {
        const hasInteraction = control.dirty || control.touched;
        const isInvalid = control.invalid;
        this.isFormValid = control.invalid;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
      }
      return false;
    }
  };

  closePopUp() {
    // popupFunctionObject.closePopUp();
    this.isLoading = false;
  }

  closePopUpAndRefresh() {
    // popupFunctionObject.closePopUp();
    this.isLoading = false;
    this.window.location.reload();
  }
}

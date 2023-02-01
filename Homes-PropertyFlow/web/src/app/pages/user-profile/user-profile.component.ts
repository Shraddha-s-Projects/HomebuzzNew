import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
// import { } from "googlemaps";
import { UserVM } from './user-profile';
import { UtilityComponent } from '../../../app/core/services/utility';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from './user-profile.service';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../app/core/services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public isUpdate: boolean;
  public userVM: UserVM;
  public isUserNameValid: boolean;
  public userNameValidMsg: string;
  public isLastNameValid: boolean;
  public lastNameValidMsg: string;
  public isEmailValid: boolean = false;
  public isFirstnameValid: boolean = false;
  public emailErrorMessage: string;
  public userId: number;
  public imgURL: any;
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });
  public isLoading: boolean;
  public isBrowser: boolean;
  public isPhoneNoValid: boolean;
  public phoneNoValidMsg: string = '';

  public error: any = {
    firstName: this.errorMessage.error('RequiredFirstName'),
    lastName: this.errorMessage.error('RequiredLastName'),
    emailRequired: this.errorMessage.error('RequiredEmail'),
    emailInvalid: this.errorMessage.error('InvalidEmail'),
    // selectTerms: this.errorMessage.error('SelectTerms'),
    // passwordInvalid: this.errorMessage.error('InvalidPassword'),
    // repetEmailNotMatch: this.errorMessage.error('RepetEmailNotMatch')
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private errorMessage: ErrorMessage,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["userId"]) {
        this.userId = +params["userId"];
      }
    });
    this.userVM = new UserVM();
    this.getUser();
    // this.userVM.FirstName = "Shraddha";
    // this.userVM.UserName = "Shraddha";
    // this.userVM.Email = "shraddha.prajapati@techavidus.com";
    // this.userVM.phone = "1212121212";
    // this.userVM.LastName = "Prajapati";
    // this.userVM.role = "Agent";

  }

  validateUsername() {
    var illegalChars = /\W/; // allow letters, numbers, and underscores

    if (this.userVM.UserName == "") {
      this.userNameValidMsg = "You didn't enter an user name";
      this.isUserNameValid = false;
      return false;

    } else if ((this.userVM.UserName.length < 5) || (this.userVM.UserName.length > 15)) {
      this.userNameValidMsg = "Username minimum length is 5 characters or maximum 15 characters";
      this.isUserNameValid = false;
      return false;

    } else if (illegalChars.test(this.userVM.UserName)) {
      this.userNameValidMsg = "The username contains illegal characters";
      this.isUserNameValid = false;
      return false;

    } else if (!this.userVM.UserName.trim()) {
      this.userNameValidMsg = "You are not allowed to add blank space";
      this.isUserNameValid = false;
      return false;
    } else {
      this.isUserNameValid = true;
      this.userNameValidMsg = '';
    }
    return true;
  }

  validateLastname() {
    var illegalChars = /\W/; // allow letters, numbers, and underscores

    if (this.userVM.LastName == "") {
      this.lastNameValidMsg = "";
      this.isLastNameValid = true;
      return true;

    } else if (illegalChars.test(this.userVM.LastName)) {
      this.lastNameValidMsg = "The lastName contains illegal characters";
      this.isLastNameValid = false;
      return false;

    } else if (!this.userVM.LastName.trim()) {
      this.lastNameValidMsg = "You are not allowed to add blank space";
      this.isLastNameValid = false;
      return false;
    } else {
      this.isUserNameValid = true;
      this.lastNameValidMsg = '';
    }
    return true;
  }

  isStringOnly(str: string) {
    let isStringify = UtilityComponent.isStringOnly(str);
    let isTrimmed = str.trim() ? true : false;
    return isStringify && isTrimmed ? true : false;
  }

  validFirstName() {
    this.isFirstnameValid = this.isStringOnly(this.userVM.FirstName)
  }

  errorMessageEmail() {
    if (!this.userVM.Email) {
      this.isEmailValid = false;
      this.emailErrorMessage = this.error.emailRequired;
      return false;
    } else if (this.userVM.Email == "") {
      this.isEmailValid = false;
      this.emailErrorMessage = "You didn't enter an email";
    }
    else {
      this.isEmailValid = UtilityComponent.validateEmail(this.userVM.Email);
      this.emailErrorMessage = this.error.emailInvalid;
    }

  }

  updateUser() {

  }

  getUser() {
    this.userProfileService.getUserById(this.userId).subscribe((data: any) => {
      if (data.Success) {
        this.userVM = data.Model;
        this.isLoading = true;
        this.validateUsername();
        this.validFirstName();
        this.validateLastname();
        this.errorMessageEmail();
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for profile module. Please login.", false);
        }
      });
  }

  updateUserProfile() {
    this.isUpdate = true;
    this.userVM.UserId = this.userId;
    this.userProfileService.updateUserProfile(this.userVM).subscribe((data: any) => {
      if (data.Success) {
        this.commonService.toaster("Update profile successfully.", true);
        this.router.navigate(["/dashboard"])
      } else {
        this.commonService.toaster(data.ErrorMessage, false);
      }
      this.isUpdate = false;
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for profile module. Please login.", false);
        }
        this.isUpdate = false;
      });
  }

  validatePhoneNo() {
    if (!this.userVM.PhoneNo) {
      this.phoneNoValidMsg = "";
      this.isPhoneNoValid = true;
      return true;
    } else {
      this.isPhoneNoValid = UtilityComponent.validatePhoneNumber(this.userVM.PhoneNo);
      if (!this.isPhoneNoValid) {
        this.phoneNoValidMsg = "Please enter valid phone no";
        return false;
      }
      this.isPhoneNoValid = true;
      this.phoneNoValidMsg = '';
    }
    return true;
  }

  onselectFileChange(event) {
    this.detectFiles(event);
  }

  detectFiles(event) {
    let file = event.target.files[0];

    // for (let file of files) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let object = new Object();
    reader.onload = _event => {
      this.imgURL = reader.result;
    };
  }
}


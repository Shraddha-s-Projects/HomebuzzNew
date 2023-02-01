import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage } from '../../../../app/core/services/errormessage.service';
import { signupAgentModel, SubScriptionPlan, Option, BillingPlan, Agreement, EmailValidate } from './agent-signup';
import { UtilityComponent } from '../../../../app/core/services/utility';
import { AgentSignUpService } from './agent-signup.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthMessageComponent } from '../../../../app/modal/auth-message/auth-message.component';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../../../app/core/services/common.service';
import { ToasterConfig } from 'angular2-toaster';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

const Phone_Regex = "/^(0|(\+64(\s|-)?)){1}(21|22|27){1}(\s|-)?\d{3}(\s|-)?\d{4}$/";

@Component({
  selector: 'app-agent-signup',
  templateUrl: './agent-signup.component.html',
  styleUrls: ['./agent-signup.component.css']
})
export class AgentSignupComponent implements OnInit {

  //toaster config
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  public isFirsStepComplete: boolean = true;
  public isSecondStepComplete: boolean;
  public isThirdStepComplete: boolean;
  public isFourthStepComplete: boolean;
  public isFifthStepComplete: boolean;

  public isOpenSignUp: boolean;
  public isComplete: boolean;
  public isEmailFill: boolean;
  public selectedIndex = 0;
  public isPayment: boolean;
  public signupAgent: signupAgentModel;
  public SubscriptionPlanList: SubScriptionPlan[] = [];
  public NoOfAgent: number = 1;
  public totalPrice: number;
  public selectedPrice: number;
  public error: any = {
    userName: this.errorMessage.error('RequiredName'),
    emailRequired: this.errorMessage.error("RequiredEmail"),
    emailInvalid: this.errorMessage.error("InvalidEmail"),
    companyName: this.errorMessage.error('RequiredCompanyName'),
    phoneRequired: this.errorMessage.error('RequiredPhone')
  };

  public isEmailValid: boolean = false;
  public isLoading: boolean;
  public emailValidMsg: string;
  public isPhoneNoValid: boolean;
  public phoneNoValidMsg: string;
  public isUserNameValid: boolean;
  public userNameValidMsg: string;
  public isCompanyNameValid: boolean;
  public companyNameValidMsg: string;
  public selectedSubscriptionPlanId: number;
  public token: string;
  public ba_token: string;
  public agreementDetail: Agreement;
  public subscriptionPlanOptions: Option[] = [];
  public emailArr: EmailValidate[] = [];
  public isCheckEmail: boolean;
  public isDisableNoOfAgentDdl: boolean;
  public isCompletePayment: boolean;
  public isEditable: boolean = true;
  public isBrowser: boolean;

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private _formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private errorMessage: ErrorMessage,
    private agentSignUpService: AgentSignUpService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    public dialog: MatDialog) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.signupAgent = new signupAgentModel();
    this.firstFormGroup = this._formBuilder.group({
    });
    this.secondFormGroup = this._formBuilder.group({
    });
    this.thirdFormGroup = this._formBuilder.group({
    });
    this.fourthFormGroup = this._formBuilder.group({
    });
    this.addDynamicCassSetForStepper();
    this.getAllSubscriptionPlan();
    this.route.queryParams.subscribe(params => {
      if (params["token"] && params["ba_token"]) {
        this.token = params["token"];
        this.ba_token = params["ba_token"];
        var model = this.localStorage.getItem("AgentSignUp");
        this.signupAgent = new signupAgentModel();
        if (model) {
          this.signupAgent = JSON.parse(model);
        }
        this.goForward(this.signupAgent.SubscriptionPlan);
        this.NoOfAgent = this.signupAgent.NoOfAgent;
        this.totalPrice = this.signupAgent.TotalPrice;
        this.isOpenSignUp = true;
        this.isLoading = false;
        this.isPayment = false;
        this.emailArr = this.signupAgent.AgentEmails;
        this.isDisableNoOfAgentDdl = true;
        let emailLenght = this.emailArr.filter(t => t.Email != "" && t.IsEmailValid == true).length;
        this.emailArr.length == emailLenght ? this.isComplete = true : this.isComplete = false;
        this.selectedIndex = 4;
        this.addDynamicCassSetForStepper();
        this.localStorage.removeItem("AgentSignUp");
        this.isEditable = false;
        this.executeAgreement();
      }
      if (params["cancel"]) {
        var model = this.localStorage.getItem("AgentSignUp");
        this.signupAgent = new signupAgentModel();
        if (model) {
          this.signupAgent = JSON.parse(model);
        }
        this.goForward(this.signupAgent.SubscriptionPlan);
        this.NoOfAgent = this.signupAgent.NoOfAgent;
        this.totalPrice = this.signupAgent.TotalPrice;
        this.isOpenSignUp = true;
        this.isLoading = false;
        this.isPayment = false;
        this.emailArr = this.signupAgent.AgentEmails;
        let emailLenght = this.emailArr.filter(t => t.Email != "" && t.IsEmailValid == true).length;
        this.emailArr.length == emailLenght ? this.isComplete = true : this.isComplete = false;
        this.selectedIndex = 2;
        this.addDynamicCassSetForStepper();
        this.commonService.toaster("Payment failed.", false);
        this.localStorage.removeItem("AgentSignUp");
      }
    });
  }

  openSignUp() {
    this.isOpenSignUp = true;
  }

  errorMessageEmail() {
    if (!this.signupAgent.email) {
      this.isEmailValid = false;
      this.emailValidMsg = "Email address cannot be empty"
      // return this.error.emailRequired;
    } else {
      this.isEmailValid = UtilityComponent.validateEmail(this.signupAgent.email);
      if (!this.isEmailValid) {
        this.emailValidMsg = "Invalid email address";
      }
      // return this.error.emailInvalid;
    }
  }

  errorMessageEmailArr(emailObj: EmailValidate) {
    if (!emailObj.Email) {
      emailObj.IsEmailValid = false;
      emailObj.EmailValidMsg = "Email address cannot be empty";
      // return this.error.emailRequired;
    } else {
      emailObj.IsEmailValid = UtilityComponent.validateEmail(emailObj.Email);
      if (!emailObj.IsEmailValid) {
        emailObj.EmailValidMsg = "Invalid email address";
      }
      // return this.error.emailInvalid;
    }
    if (emailObj.IsEmailValid == true) {
      if (emailObj.Email == this.signupAgent.email) {
        emailObj.EmailValidMsg = "Email address not same as company email";
        emailObj.IsEmailValid = false;
      }
      this.emailArr.forEach(element => {
        if (emailObj.Id != element.Id) {
          if (emailObj.Email == element.Email) {
            emailObj.EmailValidMsg = "Email already exist";
            emailObj.IsEmailValid = false;
          }
        }
      });
    }
    if (emailObj.IsEmailValid == true) {
      emailObj.CompanyName = this.signupAgent.companyName;
      this.CheckEmailDuplicate(emailObj);
    }
    if (emailObj.EmailValidMsg != "") {
      let index = this.emailArr.findIndex(t => t.Id == emailObj.Id);
      index > -1 ? this.emailArr[index] = emailObj : false;
      let emailLenght = this.emailArr.filter(t => t.Email != "" && t.IsEmailValid == true).length;
      this.emailArr.length == emailLenght ? this.isEmailFill = true : this.isEmailFill = false;
    }
    // let index = this.emailArr.findIndex(t => t.Id == emailObj.Id);
    // index > -1 ? this.emailArr[index] = emailObj : false;
    // let emailLenght = this.emailArr.filter(t => t.Email != "" && t.IsEmailValid == true).length;
    // this.emailArr.length == emailLenght ? this.isEmailFill = true : this.isEmailFill = false;
  }

  CheckEmailDuplicate(emailObj: EmailValidate) {
    this.isCheckEmail = true;
    this.agentSignUpService.validateAgentEmail(emailObj).subscribe((data: any) => {
      if (data.Success) {
      } else {
        let index = this.emailArr.findIndex(t => t.Id == emailObj.Id);
        index > -1 ? this.emailArr[index] = emailObj : false;
        this.emailArr[index] = data.Model;
      }
      this.isCheckEmail = false;
      let emailLenght = this.emailArr.filter(t => t.Email != "" && t.IsEmailValid == true).length;
      this.emailArr.length == emailLenght ? this.isEmailFill = true : this.isEmailFill = false;
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
  }

  validateUsername() {
    var error = "";
    var illegalChars = /\W/; // allow letters, numbers, and underscores

    if (!this.signupAgent.userName) {
      this.userNameValidMsg = "Name cannot be empty";
      this.isUserNameValid = false;
      return false;

    } else if (this.signupAgent.userName.length < 5) {
      this.userNameValidMsg = "Name minimum length is 5 characters";
      this.isUserNameValid = false;
      return false;

    } else if (illegalChars.test(this.signupAgent.userName)) {
      this.userNameValidMsg = "The name contains illegal characters";
      this.isUserNameValid = false;
      return false;

    } else if (!this.signupAgent.userName.trim()) {
      this.userNameValidMsg = "You are not allowed to add blank space";
      this.isUserNameValid = false;
      return false;
    } else {
      this.isUserNameValid = true;
      this.userNameValidMsg = '';
    }
    return true;
  }

  validateCompanyName() {
    if (this.signupAgent.companyName == "") {
      this.companyNameValidMsg = "Company name cannot be empty";
      this.isCompanyNameValid = false;
      return false;
    }
    else if (!this.signupAgent.companyName.trim()) {
      this.companyNameValidMsg = "You are not allowed to add blank space";
      this.isCompanyNameValid = false;
      return false;
    } else {
      //fld.style.background = 'White';
      this.isCompanyNameValid = true;
      this.companyNameValidMsg = '';
    }
    return true;
  }

  validatePhoneNo() {
    if (!this.signupAgent.phone) {
      this.phoneNoValidMsg = "Phone no cannot be empty";
      this.isPhoneNoValid = false;
      return false;
    }
    else if (!this.signupAgent.phone.trim()) {
      this.phoneNoValidMsg = "You are not allowed to add blank space";
      this.isPhoneNoValid = false;
      return false;
    } else {
      this.isPhoneNoValid = UtilityComponent.validatePhoneNumber(this.signupAgent.phone);
      if (!this.isPhoneNoValid) {
        this.phoneNoValidMsg = "Please enter valid phone no";
        return false;
      }
      //fld.style.background = 'White';
      this.isPhoneNoValid = true;
      this.phoneNoValidMsg = '';
    }
    return true;
  }

  getAllSubscriptionPlan() {
    this.agentSignUpService.getAllSubscriptionPlan().subscribe((data: any) => {
      if (data.Success) {
        this.SubscriptionPlanList = data.Model;
        this.SubscriptionPlanList.forEach(element => {
          if (element.SubscriptionPlanDetail && element.Id != 4) {
            if (element.SubscriptionPlanDetail.Price){
              let price = element.SubscriptionPlanDetail.Price.toString().split(".");
              element.SubscriptionPlanDetail.FirstPrice = price[0];
              element.SubscriptionPlanDetail.SecondPrice = price[1];
            }
          }
        });
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
  }

  selectionChange(event) {
    // if(!this.isUserNameValid && !this.isEmailValid && !this.isCompanyNameValid && !this.isPhoneNoValid){
    //   return false;
    // } else {
    this.selectedIndex = event.selectedIndex;
    this.addDynamicCassSetForStepper();

    // }
    // console.log(this.selectedIndex);
  }

  addDynamicCassSetForStepper() {
    if (this.selectedIndex == 0) {
      this.isFirsStepComplete = true;
      this.isSecondStepComplete = false;
      this.isThirdStepComplete = false;
      this.isFourthStepComplete = false;
      this.isFifthStepComplete = false;
    } else if (this.selectedIndex == 1) {
      this.isFirsStepComplete = true;
      this.isSecondStepComplete = true;
      this.isThirdStepComplete = false;
      this.isFourthStepComplete = false;
      this.isFifthStepComplete = false;
    } else if (this.selectedIndex == 2) {
      this.isFirsStepComplete = true;
      this.isSecondStepComplete = true;
      this.isThirdStepComplete = true;
      this.isFourthStepComplete = false;
      this.isFifthStepComplete = false;
    } else if (this.selectedIndex == 3) {
      this.isFirsStepComplete = true;
      this.isSecondStepComplete = true;
      this.isThirdStepComplete = true;
      this.isFourthStepComplete = true;
      this.isFifthStepComplete = false;
    } else {
      this.isFirsStepComplete = true;
      this.isSecondStepComplete = true;
      this.isThirdStepComplete = true;
      this.isFourthStepComplete = true;
      this.isFifthStepComplete = true;
    }
  }

  goForward(plan: SubScriptionPlan) {
    this.signupAgent.SubscriptionPlan = plan;
    this.selectedSubscriptionPlanId = plan.Id;
    this.selectedPrice = +plan.SubscriptionPlanDetail.Price;
    if (plan.Id > 1) {
      let min;
      let max;
      if (plan.Id < 4) {
        let option = plan.SubscriptionPlanDetail.Agents.split(" - ");
        min = +option[0];
        max = +option[1];
      } else {
        min = 51;
        max = 100;
      }
      this.NoOfAgent = min;
      this.totalPrice = min * this.selectedPrice;
      this.addRemoveEmailArr();
      this.subscriptionPlanOptions = [];
      for (let index = min; index <= max; index++) {
        let option = new Option();
        option.Value = index;
        this.subscriptionPlanOptions.push(option);
      }
      let emailLenght = this.emailArr.filter(t => t.Email != "" && t.IsEmailValid == true && t.EmailValidMsg == "").length;
      this.emailArr.length == emailLenght ? this.isEmailFill = true : this.isEmailFill = false;
    } else {
      this.totalPrice = +plan.SubscriptionPlanDetail.Price;
      this.emailArr = [];
      this.isEmailFill = true;
    }
  }

  onSubmitDetails() {
    this.agentSignUpService.validateAgent(this.signupAgent).subscribe((data: any) => {
      if (data.Success) {
        this.selectedIndex = 1;
      } else {
        var Model = data.Model;
        if (Model.IsCompanyEmailAlreadyExist) {
          this.emailValidMsg = "Email already exist";
          this.isEmailValid = false;
        }
        if (Model.IsCompanyPhoneNoAlreadyExist) {
          this.phoneNoValidMsg = "Phone no already exist";
          this.isPhoneNoValid = false;
        }
        if (Model.IsCompanyNameAlreadyExist) {
          this.companyNameValidMsg = "Company name already exist";
          this.isCompanyNameValid = false;
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
  }

  onSelectAgent(event) {
    this.NoOfAgent = +event.target.value;
    this.addRemoveEmailArr();
  }

  addRemoveEmailArr() {
    this.totalPrice = ((this.NoOfAgent) * (this.selectedPrice));
    this.totalPrice = +this.totalPrice.toFixed(3);
    let length = this.emailArr.length;
    if (length > 0) {
      if (length < this.NoOfAgent) {
        for (let index = length + 1; index <= this.NoOfAgent; index++) {
          let element: any = {
            Id: index,
            Email: "",
            Name: "AgentEmail" + index,
            EmailValidMsg: "",
            IsEmailValid: false
          }
          this.emailArr.push(element);
        }
      } else if (length > this.NoOfAgent) {
        for (let index = this.NoOfAgent + 1; index <= length; index++) {
          let indexofArr = this.emailArr.findIndex(t => t.Id == index);
          this.emailArr.splice(indexofArr, 1);
        }
      }
    }
    // this.emailArr = [];
    if (this.emailArr.length == 0) {
      for (let index = 1; index <= this.NoOfAgent; index++) {
        let element: any = {
          Id: index,
          Email: "",
          Name: "AgentEmail" + index,
          EmailValidMsg: "",
          IsEmailValid: false
        }
        this.emailArr.push(element);
      }
    }
  }

  createPayment() {
    this.isPayment = true;
    this.signupAgent.NoOfAgent = this.NoOfAgent;
    this.signupAgent.TotalPrice = this.totalPrice;
    this.signupAgent.AgentEmails = this.emailArr;
    this.localStorage.setItem("AgentSignUp", JSON.stringify(this.signupAgent));
    let modal = new BillingPlan();
    modal.Description = "Test Description";
    modal.Name = "Test Plan";
    modal.Currency = "NZD";
    modal.Amount = this.totalPrice;
    modal.ReturnUrl = environment.WEBURL + "/agent/signup";
    modal.CancelUrl = environment.WEBURL + "/agent/signup?cancel=true";
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let start_date = tomorrow.toISOString();
    modal.start_date = start_date;

    this.agentSignUpService.createAgreement(modal).subscribe((data: any) => {
      if (data) {
        this.window.location.href = data;
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
  }

  executeAgreement() {
    this.agentSignUpService.executeAgreement(this.token).subscribe((data: any) => {
      if (data) {
        this.agreementDetail = data;
        this.signupAgent.AgreementId = this.agreementDetail.id;
        this.signupAgent.PlanId = this.agreementDetail.plan.id;
        this.signupAgent.Token = this.token;
        this.signupAgent.State = this.agreementDetail.state;
        this.isCompletePayment = true;
        if (typeof this.window !== 'undefined' && this.window.history) {
          this.window.history.pushState(null, null, 'agent/signup')
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
  }

  saveAgent() {
    this.isLoading = true;
    this.signupAgent.Homes = [];
    if (this.localStorage.getItem("prop_viewer")) {
      let homeArr = JSON.parse(this.localStorage.getItem("prop_viewer"));
      if (homeArr) {
        this.signupAgent.Homes = homeArr.Homes;
      }
    }

    this.agentSignUpService.agentSignUp(this.signupAgent).subscribe((data: any) => {
      this.isLoading = false;
      if (data.Success) {
        this.openSignUpSuccessModal();
      } else {
        this.commonService.toaster(data.ErrorMessage, false);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
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
      // this.isLoading = false;
    });
  }

}

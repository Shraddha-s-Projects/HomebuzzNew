import { Injectable } from '@angular/core';

// import * as data from "../../error.json";

@Injectable()
export class ErrorMessage {

   public data = {
        "RequiredFirstName": "First Name cannot be empty",
        "RequiredLastName": "Last Name cannot be empty",
        "RequiredCompanyName": "Company Name cannot be empty",
        "RequiredName": "Name cannot be empty",
        "RequiredPhone": "Phone no cannot be empty",
        "InvalidEmail": "Invalid email address",
        "InvalidPhone": "Invalid Phone Number",
        "RequiredEmail": "Email Address cannot be empty",
        "SelectTerms": "Please select you agree to LoopDASH's Terms of Use and Privacy Policy",
        "RequiredPassword": "Password cannot be empty",
        "DefaultError": "Something went wrong. Please refresh the page or try again later",
        "ErrorOccurred": "Error occurred while processing your request",
        "ItemAlreadyExist": "Item already exist",
        "InvalidPassword": "Invalid Password"
    }

    // data: any = (<any>data);
    error(selector: string) {
        return this.data[selector];
    }
}

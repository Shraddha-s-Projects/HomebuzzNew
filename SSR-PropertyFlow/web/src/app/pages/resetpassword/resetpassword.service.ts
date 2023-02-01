import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';
import { Recaptcha } from '../../../app/core/services/common';

@Injectable()
export class ResetPasswordService {
    
    constructor(private httpClient:HttpClientService) { }

    resetPassword(resetPassword:any) {
        return this.httpClient.post("/User/ResetPassword", resetPassword);
    }

    verifyRecaptchaToken(recaptcha:Recaptcha){
        return this.httpClient.post("/Common/ValidateCapchaResponse", recaptcha)
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from '../../../../app/route.config';
import { AuthService } from '../../../../app/core/services/auth.service';
import { HttpClientService } from '../../../../app/core/services/http-client.service';
import { signupAgentModel, EmailValidate } from './agent-signup';

@Injectable()
export class AgentSignUpService {
    constructor(private http: HttpClient,
        private routeConfig: RouteConfig,
        private httpClient: HttpClientService,
        private auth: AuthService) { }


    getAllSubscriptionPlan() {
        return this.httpClient.get("/SubscriptionPlan/GetAllPlan");
    }

    agentSignUp(Model: signupAgentModel) {
        return this.httpClient.post("/Agent/Signup", Model);
    }

    createAgreement(modal: any) {
        return this.httpClient.post("/Payment/CreateBillingPlan", modal);
    }

    executeAgreement(token: string) {
        return this.httpClient.get("/Payment/ExecuteAgreement?token=" + token);
    }

    validateAgent(modal: any){
        return this.httpClient.post("/Agent/AgentValidate", modal);
    }

    validateAgentEmail(modal: EmailValidate){
        return this.httpClient.post("/Agent/ValidateEmail", modal);
    }
}
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { signupuserModel } from './signupuserModel';
import { HttpClientService } from '../../../app/core/services/http-client.service';

@Injectable()
export class SignupService {

    constructor(private httpClient: HttpClientService) { }

    signUp(signupUser: signupuserModel) {
        return this.httpClient.post('/user/Signup', signupUser);
    }

    getEmailByInvitationCode(invitationCode:string){
        return this.httpClient.get('/user/Invitation/' + invitationCode);
    }

    getUserProfileForMixpanel(){
        return this.httpClient.get('/userprofile/GetUserProfileForMixpanel');
    }

    addUpdateUserKey(modal: any) {
        return this.httpClient.post('/UserKey/AddUpdate', modal);
    }
}

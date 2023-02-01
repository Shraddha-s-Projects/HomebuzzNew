import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { verifyUser, CreatePassword } from './verifyUser';
import { HttpClientService } from '../../../app/core/services/http-client.service';
import { RouteConfig } from '../../../app/route.config';

@Injectable()
export class VerifyService {
  verifyUser = new verifyUser()
  
  constructor(
    private http: Http,
    private httpClient: HttpClientService, 
    private routeConfig: RouteConfig) { }

  SaveVerifyResponse(data){
    this.verifyUser.IsVerified = data.Model.IsVerified;
    this.verifyUser.IsAlreadyVerified = data.Model.IsAlreadyVerified;
    this.verifyUser.Message = data.Model.Message;
    this.verifyUser.IsVerificationCodeValid = data.Model.IsVerificationCodeValid;
  }

  GetVerifyResponse(){
    return this.verifyUser;
  }

  Verify(verifyUser:verifyUser) {
    return this.httpClient.post('/Verify/NewAccount', verifyUser);
  }

  CreateNewPassword(createPassword:CreatePassword){
    return this.httpClient.post('/User/CreateNewPassword', createPassword);
  }

  isEmailAlreadyVerified(verifyUser:verifyUser){
    return this.httpClient.post('/Verify/IsEmailAlreadyVerified', verifyUser);
  }
}

import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';
import { RouteConfig } from '../../../app/route.config';
import { verifyUser, CreatePassword } from '../verify/verifyUser';

@Injectable()
export class VerifyEmailService {
  verifyUser = new verifyUser()

  constructor(
    private http: Http,
    private httpClient: HttpClientService,
    private routeConfig: RouteConfig) { }

  SaveVerifyResponse(data) {
    this.verifyUser.IsVerified = data.Model.IsVerified;
    this.verifyUser.IsAlreadyVerified = data.Model.IsAlreadyVerified;
    this.verifyUser.Message = data.Model.Message;
    this.verifyUser.IsVerificationCodeValid = data.Model.IsVerificationCodeValid;
    this.verifyUser.ResetPasswordLink = data.Model.ResetPasswordLink;
  }

  GetVerifyResponse() {
    return this.verifyUser;
  }

  Verify(verifyUser: verifyUser) {
    return this.httpClient.post('/Verify/NewAccount', verifyUser);
  }

  isEmailAlreadyVerified(verifyUser: verifyUser) {
    return this.httpClient.post('/Verify/IsEmailAlreadyVerified', verifyUser);
  }
}

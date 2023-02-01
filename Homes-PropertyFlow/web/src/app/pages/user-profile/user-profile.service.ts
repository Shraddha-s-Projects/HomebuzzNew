import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from '../../../app/route.config';
import { AuthService } from '../../../app/core/services/auth.service';
import { HttpClientService } from '../../../app/core/services/http-client.service';

@Injectable()
export class UserProfileService {

  constructor(private http: HttpClient,
    private routeConfig: RouteConfig,
    private httpClient: HttpClientService,
    private auth: AuthService) { }

  getUserInfo() {
    return this.http.get(this.routeConfig.Url('/user'));
  }

  logout() {
    this.auth.logout();
  };

  addUpdateLocalStorage(modal: any) {
    return this.httpClient.post("/PropertyView/AddUpdatePropertyViewList", modal);
  }

  getUserById(userId: number) {
    return this.httpClient.get("/User/GetUser?UserId=" + userId);
  }

  updateUserProfile(modal: any) {
    return this.httpClient.authPost("/User/Update", modal);
  }
}

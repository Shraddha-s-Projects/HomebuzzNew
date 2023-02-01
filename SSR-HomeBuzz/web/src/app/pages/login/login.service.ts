import { LoggedInUser, UserLoginDetail } from './loginUser';
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { loginUser } from "./loginUser";
import 'rxjs/add/operator/map';
import { HttpClientService } from '../../../app/core/services/http-client.service';
import { RouteConfig } from '../../../app/route.config';
import { AuthService } from '../../../app/core/services/auth.service';

@Injectable()
export class LoginService {
  public loggedInUser: LoggedInUser

  constructor(
    private http: Http,
    private httpClient: HttpClientService,
    private routeConfig: RouteConfig,
    private auth: AuthService) {
    this.loggedInUser = new LoggedInUser();
  }

  //Get all posts from API
  getAllUsers() {
    return this.http.get(this.routeConfig.Url('/user')).map(
      res => res.json());
  }

  login(loginuser: loginUser) {
    return this.auth.login(loginuser);
  };

  getPasswordHash(password: string) {
    return this.auth.getPasswordHash(password);
  }

  addUpdateLocalStorage(modal: any) {
    return this.httpClient.post("/PropertyView/AddUpdatePropertyViewList", modal);
  }

  setLoggedInUser(data: any) {
    this.loggedInUser.UserId = data.model.UserId;
    this.loggedInUser.Role = data.model.RoleName;
    this.loggedInUser.Entity = data.model.Entity;
    this.loggedInUser.IsSignUpFinished = data.model.IsSignUpFinished;
  }

  getLoggedInUser() {
    let UserId = this.loggedInUser.UserId;
    let IsSignUpFinished = this.loggedInUser.IsSignUpFinished;
  }

  setUserLoginDetail() {
    let userLoginDetail: UserLoginDetail
    return this.httpClient.authPost("/User/SetUserLoginDetail", userLoginDetail)
  }

  logoutUser() {
    return this.httpClient.authGet("/User/logout")
  }

  addUpdateUserKey(modal: any) {
    return this.httpClient.post('/UserKey/AddUpdate', modal);
  }
}

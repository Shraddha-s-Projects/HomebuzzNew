import { Injectable, Inject } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { JwtHelperService } from "@auth0/angular-jwt";
import { RouteConfig } from "../../../app/route.config";
import { HttpClientService } from "./http-client.service";
import { loginUser } from "../../../app/pages/login/loginUser";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Injectable()
export class AuthService {
  passwordHash: string;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, 
    private http: Http,
    private routeConfig: RouteConfig,
    private router: Router,
    private httpClient: HttpClientService,
    public jwtHelper: JwtHelperService
  ) {}

  loggedIn() {
    // console.log(this.jwtHelper.getTokenExpirationDate()); // date
    // console.log(this.jwtHelper.decodeToken(localStorage.getItem("access_token"))); // token
    return !this.jwtHelper.isTokenExpired();
  }

  login(credentials: loginUser) {
    let data = new loginUser();
    data.Username = credentials.Username;
    data.Password = credentials.PasswordHash;
    data.Homes = credentials.Homes;
    data.PropertyDetailIds = [];
    return this.httpClient.post("/token", data);
  }

  logout() {
    // To log out, we just need to remove auth_token & role
    this.localStorage.removeItem("id_token");
    this.localStorage.removeItem("role");
    this.localStorage.removeItem("dateformat");
    this.localStorage.removeItem("userId");
    this.localStorage.removeItem("uid");
  }

  getPasswordHash(password): Observable<any> {
    let encodedData = this.window.btoa(password);
    return this.http.get(this.routeConfig.Url("/Common/GetPWHash/" + encodedData)).map(res => res.json());
  }

  checkLogin(credentials) {
    let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(
        this.routeConfig.Url("/token"),
        "UserName=" + credentials.Username + "&Password=" + this.passwordHash,
        options
      )
      .map(res => res.json());
  }
}

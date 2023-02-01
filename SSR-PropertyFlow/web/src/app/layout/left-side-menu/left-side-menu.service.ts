import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from "../../route.config";
import { Http,Headers, RequestOptions } from "@angular/http";
import { AuthService } from '../../../app/core/services/auth.service';

@Injectable()
export class LeftSideMenuService {

  constructor(private http: HttpClient,
    private routeConfig: RouteConfig,
    private auth: AuthService) { }

  getUserInfo() {
    return this.http.get(this.routeConfig.Url('/user'));
  }

  logout() {
    this.auth.logout();
  };

  
}

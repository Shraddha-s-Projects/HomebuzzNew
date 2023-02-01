import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { RouteConfig } from '../app/route.config';
import 'rxjs/add/operator/map';
import { HttpClientService } from './core/services/http-client.service';

@Injectable()
export class AppService {

  constructor(
    private http: Http,
    private httpClient: HttpClientService,
    private routeConfig: RouteConfig) {
  }

  logoutUser() {
    return this.httpClient.authGet("/User/logout")
  }
  
  addUpdateUserKey(modal: any) {
    return this.httpClient.post('/UserKey/AddUpdate', modal);
  }
}

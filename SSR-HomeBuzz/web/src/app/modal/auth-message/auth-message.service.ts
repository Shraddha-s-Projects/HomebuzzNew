import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from '../../../app/route.config';
import { AuthService } from '../../../app/core/services/auth.service';
import { HttpClientService } from '../../../app/core/services/http-client.service';

@Injectable()
export class AuthMessageService {

  constructor(private http: HttpClient,
    private routeConfig: RouteConfig,
    private httpClient: HttpClientService,
    private auth: AuthService) { }

    updateProperyAgent(modal: any) {
    return this.httpClient.authPost("/Agent/UpdateProperyAgent", modal);
  }

}

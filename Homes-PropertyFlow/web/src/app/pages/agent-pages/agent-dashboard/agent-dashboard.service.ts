import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from '../../../../app/route.config';
import { AuthService } from '../../../../app/core/services/auth.service';
import { HttpClientService } from '../../../../app/core/services/http-client.service';

@Injectable()
export class AgentDashboardService {

  constructor(private http: HttpClient,
    private routeConfig: RouteConfig,
    private httpClient: HttpClientService,
    private auth: AuthService) { }

  getAgentProperties(modal: any) {
    return this.httpClient.authPost("/Agent/GetAllAgentProperties", modal);
  }

  getAllAgentOptions() {
    return this.httpClient.authGet("/Agent/GetAllAgentOption");
  }

  renewClaim(queryObject: any) {
    return this.httpClient.authPost("/PropertyClaim/RenewUserClaimProperty", queryObject);
  }

  updateAgentOption(modal: any) {
    return this.httpClient.authPost("/PropertyDetail/UpdateAgentOption", modal);
  }

  unClaim(queryObject: any) {
    return this.httpClient.authPost("/PropertyClaim/DeleteUserClaimProperty", queryObject);
  }
}

import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  constructor(private httpClient: HttpClientService) { }

  getAgentsForAdmin(modal: any) {
    return this.httpClient.authPost("/Admin/GetAgents", modal);
  }

  updateUser(modal: any) {
    return this.httpClient.authPost("/Admin/Update", modal);
  }

  removeAgent(modal: any) {
    return this.httpClient.authPost("/Admin/RemoveUser", modal);
  }
}

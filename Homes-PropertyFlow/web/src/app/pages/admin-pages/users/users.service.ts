import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/core/services/http-client.service';

@Injectable()
export class UsersService {

  constructor(private httpClient: HttpClientService) { }

  getUsersForAdmin(modal: any) {
    return this.httpClient.authPost("/Admin/GetUsers", modal);
  }

  updateUser(modal: any) {
    return this.httpClient.authPost("/Admin/Update", modal);
  }

  removeUser(modal: any) {
    return this.httpClient.authPost("/Admin/RemoveUser", modal);
  }
}

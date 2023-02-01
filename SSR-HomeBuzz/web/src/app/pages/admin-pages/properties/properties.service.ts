import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  constructor(private httpClient: HttpClientService) { }

  getPropertiesForAdmin(modal: any) {
    return this.httpClient.authPost("/Admin/GetProperties", modal);
  }

  updateProperty(modal: any) {
    return this.httpClient.authPost("/Admin/UpdateProperty", modal);
  }

  removeProperty(modal: any) {
    return this.httpClient.authPost("/Admin/RemoveProperty", modal);
  }
}

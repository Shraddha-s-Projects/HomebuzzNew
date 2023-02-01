import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from '../../../app/core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AddEditHomePhotoDescriptionService {

  constructor(private httpClient: HttpClientService,
    private cookieService: CookieService) { };

  updatePropertyDetail(property: any) {
    return this.httpClient.post('/PropertyData/AddUpdatePropertyCrudData', property);
  }

  getPropertyDetail(PropertyDetailId, UserId) {
    let modal = {};
    modal["PropertyDetailId"] = PropertyDetailId;
    modal["UserId"] = UserId;
    if (this.cookieService.get("UserKey")) {
      modal["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
    }
    return this.httpClient.post("/PropertyDetail/GetPropertyDetail", modal);
  }
}

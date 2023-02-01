import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AddEditHomePhotoDescriptionService {

  constructor(private httpClient: HttpClientService) { };

  updatePropertyDetail(property: any) {
    return this.httpClient.post('/PropertyData/AddUpdatePropertyCrudData', property);
  }

  getPropertyDetail(PropertyDetailId, UserId) {
    let q = "PropertyDetailId=" + PropertyDetailId + "&UserId=" + UserId;
    return this.httpClient.get("/PropertyDetail/GetPropertyDetail?" + q);
}
}

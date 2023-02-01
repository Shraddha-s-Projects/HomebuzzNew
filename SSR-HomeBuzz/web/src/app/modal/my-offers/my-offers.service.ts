import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';
// import { MyHomes } from './my-homes';

@Injectable()
export class MyOffersService {

  constructor(private httpClient: HttpClientService) { }

  getMyOfferedHomes(Id: string) {
    return this.httpClient.authPost('/PropertyOffer/UserOffers?userId=' + Id, {});
  }
  removeMyOffer(Id: number) {
    return this.httpClient.authPost('/PropertyOffer/DeleteUserOffer?OfferId=' + Id, {});
  }

  getPropertyOfferById(Id: number) {
    return this.httpClient.authGet('/PropertyOffer/GetPropertyOfferById?OfferId=' + Id);
  }
}
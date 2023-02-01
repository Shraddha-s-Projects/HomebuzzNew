import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from '../../../../app/route.config';
import { AuthService } from '../../../../app/core/services/auth.service';
import { HttpClientService } from '../../../../app/core/services/http-client.service';

@Injectable()
export class PropertyOffersService {

  constructor(private http: HttpClient,
    private httpClient: HttpClientService) { }

    getPropertyOffersByDetailId(PropertyDetailId: number) {
    return this.httpClient.authGet("/PropertyOffer/GetPropertyOffersByDetailId?PropertyDetailId=" + PropertyDetailId);
  }

}

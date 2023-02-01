import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NegotiatePropertyOfferService {
  [x: string]: any;

  constructor(private httpClient: HttpClientService) { }

  changePropertyOfferStatus(modal: any) {
    return this.httpClient.authPost('/PropertyOffer/UpdateStatus', modal);
  }
}

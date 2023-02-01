import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';
// import { MyHomes } from './my-homes';

@Injectable()
export class MySearchService {

    constructor(private httpClient: HttpClientService) { }

    getMySearchedHomes(userId: string) {
        return this.httpClient.authPost('/PropertySearchHistory/GetUserPropertySearch?userId=' + userId, {});
    }

    removeMySearchedHomes(Id: string) {
        return this.httpClient.authPost('/PropertySearchHistory/RemovePropertySearchHistory?SearchHistoryId=' + Id, {});
    } 

    getAllPropertyStatus() {
        return this.httpClient.get('/PropertyStatus/GetAllPropertyStatus');
    }
}
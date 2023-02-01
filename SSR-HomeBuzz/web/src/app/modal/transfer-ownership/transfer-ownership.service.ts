import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../app/core/services/http-client.service";

@Injectable()
export class TransferOwnershipService {
    constructor(private httpClient: HttpClientService) { }

    transferPropertyOwnership(modal: any) {
        return this.httpClient.authPost("/PropertyClaim/TransferOwnership", modal);
    }
}
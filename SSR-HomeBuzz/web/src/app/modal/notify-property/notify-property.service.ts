import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../app/core/services/http-client.service";

@Injectable()
export class NotifyPropertyService {
    constructor(private httpClient: HttpClientService) { }

    addUpdatePropertyNotify(modal: any) {
        return this.httpClient.post("/PropertyNotify/NotifyProperty", modal);
    }

    getPropertyDetail(PropertyDetailId, UserId) {
        let q = "PropertyDetailId=" + PropertyDetailId + "&UserId=" + UserId;
        return this.httpClient.get("/PropertyDetail/GetPropertyDetail?" + q);
    }
}
import { Injectable } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from "../../../app/core/services/http-client.service";

@Injectable()
export class NotifyPropertyService {
    constructor(private httpClient: HttpClientService,
        private cookieService: CookieService) { }

    addUpdatePropertyNotify(modal: any) {
        return this.httpClient.post("/PropertyNotify/NotifyProperty", modal);
    }

    // getPropertyDetail(PropertyDetailId, UserId) {
    //     let q = "PropertyDetailId=" + PropertyDetailId + "&UserId=" + UserId;
    //     return this.httpClient.get("/PropertyDetail/GetPropertyDetail?" + q);
    // }

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
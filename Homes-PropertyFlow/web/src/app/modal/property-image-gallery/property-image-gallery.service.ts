import { Injectable } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from "../../../app/core/services/http-client.service";

@Injectable()
export class PropertyImageGalleryService {
    constructor(
        private httpClient: HttpClientService,
        private cookieService: CookieService) { }

    getSimilarProperties(modal: any) {
        return this.httpClient.post("/PropertyCrudData/GetSimilarProperties", modal);
    }

    getPropertyDetail(modal: any) {
        if (this.cookieService.get("UserKey")) {
            modal["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
        }
        return this.httpClient.post("/PropertyDetail/GetPropertyDetail", modal);
    }

    saveGoogleMapAsImage(modal: any) {
        return this.httpClient.post("/PropertyData/GooglemapToImage", modal);
    }

    getPropertyFlowInterest(PropertyDetailId) {
        let q = "PropertyDetailId=" + PropertyDetailId;
        return this.httpClient.get("/PropertyFlowInterest/GetPropertyFlowInterest?" + q);
    }

    getPropertyFlowInterestByHourly_Old(PropertyDetailId) {
        let q = "PropertyDetailId=" + PropertyDetailId;
        return this.httpClient.get("/PropertyFlowInterest/GetPropertyFlowInterestByHourly?" + q);
    }

    getPropertyFlowInterestByHourly(PropertyDetailId) {
        let q = "PropertyDetailId=" + PropertyDetailId;
        return this.httpClient.get("/PropertyFlowInterestHourly/GetPropertyFlowInterest?" + q);
    }

    getPropertyFlowInterestByDaily(PropertyDetailId) {
        let q = "PropertyDetailId=" + PropertyDetailId;
        return this.httpClient.get("/PropertyFlowInterestDaily/GetPropertyFlowInterest?" + q);
    }

    getPropertyFlowInterestByWeekly(PropertyDetailId) {
        let q = "PropertyDetailId=" + PropertyDetailId;
        return this.httpClient.get("/PropertyFlowInterestWeekly/GetPropertyFlowInterest?" + q);
    }

    savePropertyDetailAndPropertyCRUD(PropertyDetailId) {
        return this.httpClient.get("/PropertyCrudData/IncreaseViewCount?PropertyDetailId=" + PropertyDetailId);
    }

    savePropertyViewCount(modal: Object) {
        return this.httpClient.post("/PropertyView/AddUpdatePropertyView", modal);
    }
}
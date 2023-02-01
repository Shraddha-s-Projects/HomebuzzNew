import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../app/core/services/http-client.service";

@Injectable()
export class PropertyImageGalleryService {
    constructor(private httpClient: HttpClientService) { }

    getSimilarProperties(modal: any) {
        return this.httpClient.post("/PropertyCrudData/GetSimilarProperties", modal);
    }

    getPropertyDetail(PropertyDetailId, UserId) {
        let q = "PropertyDetailId=" + PropertyDetailId + "&UserId=" + UserId;
        return this.httpClient.get("/PropertyDetail/GetPropertyDetail?" + q);
    }

    saveGoogleMapAsImage(modal: any) {
        return this.httpClient.post("/PropertyData/GooglemapToImage", modal);
    }
}
import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../app/core/services/http-client.service";
import { PropertyDetail, PropertyLike } from "./search-result-page";
import { PropertyClaim } from "../../../app/modal/claim-home/claim-home";
import { PropertyOffer } from "../../../app/modal/make-offer/make-offer";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class SearchResultPageService {
  constructor(private httpClient: HttpClientService,
    private cookieService: CookieService
  ) { }

  getProperties(modal: any) {
    if (this.cookieService.get("UserKey")) {
      modal["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
    }
    return this.httpClient.post("/PropertyCrudData/GetAllPropertyCrudData", modal);
  }

  getRanking(modal: any) {
    modal["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
    return this.httpClient.post("/PropertyData/PropertyRank", modal);
  }

  getRankedProperties(modal: any) {
    modal["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
    return this.httpClient.post("/PropertyData/RankedProperty", modal);
  }

  activeProperty(modal: any) {
    return this.httpClient.post("/PropertyCrudData/AddUpdatePropertyDetailAndPropertyCRUD", modal);
  }

  saveProperties(modal: any) {
    return this.httpClient.post("/PropertyCrudData/SavePropertyCRUD", modal);
  }

  addOrUpdate(modal: PropertyDetail) {
    return this.httpClient.post("/PropertyDetail/AddUpdateProperty", modal);
  }

  likeProperty(modal: PropertyLike) {
    return this.httpClient.authPost("/PropertyLike/LikeDislikeProperty", modal);
  }

  claimHome(modal: PropertyClaim) {
    return this.httpClient.authPost("/PropertyClaim/ClaimProperty", modal);
  }

  makeOffer(modal: PropertyOffer) {
    return this.httpClient.authPost("/PropertyOffer/MakeOffer", modal);
  }

  // cookies
  addviewCount(propId: string) {
    return this.httpClient.post("/PropertyData/addviewCount", propId);
  }

  savePropertyViewCount(modal: Object) {
    return this.httpClient.post("/PropertyView/AddUpdatePropertyView", modal);
  }
  getPropertiesView(modal: any) {
    return this.httpClient.post("/PropertyCrudData/GetAllPropertyViews", modal);
  }

  savePropertyDetailAndPropertyCRUD(PropertyDetailId) {
    return this.httpClient.get("/PropertyCrudData/IncreaseViewCount?PropertyDetailId=" + PropertyDetailId);
  }

  savePropertySearchHistory(modal: any) {
    return this.httpClient.authPost("/PropertySearchHistory/AddPropertySearch", modal);
  }

  getPropertySearchHistory(searchId: number) {
    return this.httpClient.authGet("/PropertySearchHistory/GetPropertySearchById?searchId=" + searchId);
  }

  getAllPropertyStatus() {
    return this.httpClient.get('/PropertyStatus/GetAllPropertyStatus');
  }

  saveGoogleMapAsImage(modal: any) {
    return this.httpClient.post("/PropertyData/GooglemapToImage", modal);
  }

  isGoogleImageExist(propertyId: number) {
    return this.httpClient.get("/PropertyData/IsExistGoogleImage?PropertyId=" + propertyId);
  }

  getSubHurbPropertiesInfo(modal: any) {
    return this.httpClient.post("/PropertyData/GetSubHurbPropertyInfo", modal);
  }

  getSimilarSubHurbProperties(modal: any) {
    return this.httpClient.post("/PropertyCrudData/GetAllSubHurbProperties", modal);
  }

  getAllAgentOptions() {
    return this.httpClient.authGet("/Agent/GetAllAgentOption");
  }

  updateAgentOption(modal: any) {
    return this.httpClient.authPost("/PropertyDetail/UpdateAgentOption", modal);
  }

  unClaim(queryObject: any) {
    return this.httpClient.authPost("/PropertyClaim/DeleteUserClaimProperty", queryObject);
  }

  addUpdateUserKey(modal: any) {
    return this.httpClient.post('/UserKey/AddUpdate', modal);
  }
}

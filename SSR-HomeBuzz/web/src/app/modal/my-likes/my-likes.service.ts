import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../app/core/services/http-client.service";

@Injectable({
  providedIn: "root"
})
export class MyLikesService {
  constructor(private httpClient: HttpClientService) {}

  getMyLikedHomes(Id: string) {
    return this.httpClient.authPost("/PropertyLike/UserPropertyLikes?userId=" + Id, {});
  }

  getUserInfo(UserId: Number){
    return this.httpClient.authPost("/PropertyLike/UserInfo?userId=" + UserId, {});
  }
}

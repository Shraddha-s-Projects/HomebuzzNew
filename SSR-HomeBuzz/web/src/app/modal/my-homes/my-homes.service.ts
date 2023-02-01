import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../app/core/services/http-client.service";
import { Home } from "./my-homes";
// import { MyHomes } from './my-homes';

@Injectable()
export class MyHomeService {
  constructor(private httpClient: HttpClientService) {}

  getMyClaimedHomes(Id: string) {
    return this.httpClient.authPost("/PropertyClaim/UserClaims?userId=" + Id, {});
  }

  renewClaim(queryObject: any) {
    return this.httpClient.authPost("/PropertyClaim/RenewUserClaimProperty", queryObject);
  }

  unClaim(queryObject: any) {
    return this.httpClient.authPost("/PropertyClaim/DeleteUserClaimProperty", queryObject);
  }
}

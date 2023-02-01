import { NegotiatePropertyOfferModule } from "../../../app/modal/negotiate-property-offer/negotiate-property-offer.module";

export class IHomeViewerCookie {
  Ids: any;
}

export class IPropertyViewerCookie {
  Homes: IHomeCoockie[];
  // CookieInitialDate : String;

  constructor() {
    this.Homes = [];
  }
}

export class IHomeCoockie {
  Id: string;
  ViewDate: string;
  UserKey: string;
}

export class Property {
  Id: number;
  PropertyDetailId: number;
  PropertyId: number;
  Address: String;
  Suburb: string;
  City: string;
  HomebuzzEstimate: number;
  Bedrooms: number;
  Bathrooms: number;
  Carparks: number;
  Landarea: number;
  CarSpace: number;
  IsActive: boolean;
  IsClaimed: boolean;
  ViewCount: number;
  ComparativeInterest: number;
  ViewBlock: number;
  Performance: string;
  PerformanceRange: number;
  HigherPerformanceRange: number;
  LowerPerformanceRange: number;
  OwnerId: number;
  Status: String;
  ImageIdList: any;
  LatitudeLongitude: String;
  UserLiked: boolean;
  UserOffered: boolean;
  ImageURL: string;
  lat: number;
  lng: number;
  Day: string;
  Time: string;
  AskingPrice: number;
  GoogleImage: string;
  MaxViewCount: number;
  isLoadGoogleImageDiv: boolean;
  IsShowAskingPrice: boolean;
  Description: string;
  AgentOptionId: number;
  AgentOption: string;
  AgentOptionArr: AgentOption[];
  AgentId: number;
  IsAgentListProperty: boolean;
  OfferedCount: number;
  DayLeft: number;
  CreatedOn: Date;
  AppraisalPrice: number;
  IsViewedInWeek: boolean;
  Ranking: number;
  RankingStatus: string;
  ViewerStrength: string;
  IsSameLatLong: boolean;
  IsAddedMultiLabel: boolean;
}

export class PropertyDetail {
  Id: number;
  PropertyId: number;
  OwnerId: number;
  IsActive: boolean;
  ViewCount: number;
  ImageURL: string;
  IsClaimed: boolean;
  Status: string;
  ActivatedDate: Date;
}

export class PropertyLike {
  Id: number;
  PropertyDetailId: number;
  PropertyId: number;
  UserId: number;
  LikedOn: Date;
}

export class TimePeriod {
  Name: String;
  From: String;
  To: String;
  Rang: String;
}
export class PropertyView {
  PropertyDetailId: number[];
  UserId: number;
  ViewDate: Date;
}

export class PriceFilterVM {
  Name: String;
  Value: number;
}

export enum PropertyStatus {
  Notlisted = 'Not listed',
  Premarket = 'Pre-market',
  ForSale = 'For sale'

  // Viewed = 'Viewed',
  // ViewedOwnerActive = 'Viewed / Owner active',
  // OpenHomeOwnerActive = 'Open home / Owner active',
  // ForSaleOwnerActive = 'For sale / Owner active'
}

export class PropertyStatusVM {
  Id: number;
  Name: string;
  IsDeleted: boolean;
}

export class RankedPropertyVM {
  Id: number;
  Ranked60: number;
  Ranked30: number;
  Ranked: number;
  PropertyDetailId: number;
  LastViewed: string;
  PropertyId: number;
  Status: string;
  TotalRank: number;
  ViewBlock: number;
  PropertyWeight: number;
  FlowLineWeight: number;
}

export class UserPropertyInfo {
  UserId: number;
  Email: string;
  FirstName: string;
  IsEmailVerified: boolean;
  likes: number;
  offers: number;
  claims: number;
  searches: number;
}

export class SubHurbPropertyInfo {
  ActiveProperties: number;
  ViewedProperties: number;
  ClaimedProperties: number;
  ForSaleProperties: number;
  AverageEstimatePrice: number;
}

export class AgentOption {
  Id: number;
  Option: string;
}

export class HotPropertyFlowInterestVM {
  PropertyDetailId: number;
  FlowInterest: any[];
}
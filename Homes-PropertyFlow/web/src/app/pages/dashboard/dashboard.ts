export class DashboardResult{
  public Clients:number;
  public Properties:number;
  public Teams:number;
  public Activities:number;
  public Files:number;
}

export class UserDashboard{
    Item : Array<DashboardResult> = [];
}

export class Property {
  Id: number;
  PropertyDetailId: number;
  Address: String;
  HomebuzzEstimate: number;
  Bedrooms: number;
  Bathrooms: number;
  CarSpace: number;
  Landarea: number;
  IsActive: boolean;
  IsClaimed: boolean;
  ViewCount: number;
  OwnerId: number;
  Status: String;
  LatitudeLongitude: String;
  UserLiked: boolean;
  UserOffered: boolean;
  ImageURL: string;
  lat: number;
  lng: number;
}

export class Payment {
  Id: number;
  UserId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Amount: number;
  ReturnUrl: string;
  CancelUrl: string;
  Intent: string;
  Currency: string;
  Description: string;
}
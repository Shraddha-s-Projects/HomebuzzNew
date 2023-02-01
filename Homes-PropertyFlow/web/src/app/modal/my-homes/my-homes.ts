export class Offer {
  OfferId: number;
  Id: number;
  OfferingAmount: number;
  OfferedOn: string;
  Status: string;
  Address: string;
  Suburb: string;
  City: string;
}
export class Home {
  Id: number;
  HomebuzzEstimate: string;
  Bedrooms: string;
  Bathrooms: string;
  CarSpace: string;
  Address: string;
  Suburb: string;
  City: string;
  ActivatedOn: string;
  HomeStatus: string;
  UserId: number;
  Offers: Offer[];
  PropertyClaimedDate: Date;
  PropertyDetailId: number;
  Landarea: number;
  DayLeft: number;
}

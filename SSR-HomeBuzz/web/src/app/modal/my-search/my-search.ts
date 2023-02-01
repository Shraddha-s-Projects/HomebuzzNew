export class MySearch {
    Id: number;
    PropertyId: number;
    UserId: number;
    Address: string;
    Bedrooms: string;
    Bathrooms: string;
    PropertyStatusId: string;
    PropertyStatus: string;
    PropertyStatusList: string;
    MinPrice: number;
    MaxPrice: number;
    IsExactMatchBed: boolean;
    IsExactMatchBath: boolean;
    IsDeleted: boolean;
    FromDate: Date;
    ToDate: Date;
    CreatedOn: Date;
    AddressType: string;
    SearchTerm: string;
    From: number;
    To: number;
}

export class PropertyStatus {
    Id: number;
    Name: string;
    IsDeleted: boolean;
}
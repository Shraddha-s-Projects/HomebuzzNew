export class PropertyVM {
    Id: number;
    PropertyDetailId: number;
    PropertyId: number;
    Address: string;
    Suburb: string;
    City: string;
    HomebuzzEstimate: number;
    AskingPrice: number;
    Bedrooms: string;
    Bathrooms: string;
    CarSpace: string;
    Landarea: string;
    IsActive: boolean;
    Status: string;
    Description: string;
    LatitudeLongitude: string;
    Latitude: string;
    Longitude: string;
    TotalCount: number;
    OrderColumnName: string;
    OrderColumnDir: string;
    PageNum: number;
    PageSize: number;
    isEdit: boolean;
}

export class Status{
    Id: number;
    Name: string;
    IsActive: boolean;
}
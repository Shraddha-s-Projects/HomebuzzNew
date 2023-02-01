export class AgentOption {
    Id: number;
    Option: string;
}

export class AgentProperty {
    Id: number;
    PropertyDetailId: number;
    PropertyId: number;
    Address: String;
    Suburb: String;
    City: String;
    HomebuzzEstimate: number;
    Bedrooms: number;
    Bathrooms: number;
    CarSpace: number;
    Landarea: number;
    IsActive: boolean;
    IsClaimed: boolean;
    ViewCount: number;
    ComparativeInterest: number;
    ViewBlock: number;
    Performance: string;
    PerfomanceRange: number;
    HigherPerfomanceRange: number;
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
    DayLeft: number;
}
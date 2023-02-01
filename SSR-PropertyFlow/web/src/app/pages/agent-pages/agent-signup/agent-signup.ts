export class signupAgentModel {
    userName: string;
    email: string;
    repeatemail: string;
    firstName: string;
    lastName: string;
    companyName: string;
    password: string;
    repeatPassword: string;
    phone: string;
    role: string;
    Entity: string;
    isTermsSelected: boolean;
    isPrivacySelected: boolean;
    inviteCode: string;
    IndustryRoleId: number = 0;
    IsCapchaVerified: boolean;
    IsPasswordMatchRule: boolean;
    Coockie: string;
    PropertyDetailIds: number[];
    Homes: IHomeCoockie[];
    SubscriptionPlan: SubScriptionPlan;
    NoOfAgent: number;
    TotalPrice: number;
    ReturnUrl: string;
    CancelUrl: string;
    AgreementId: string;
    PlanId: string;
    Token: string;
    State: string;
    AgentEmails: EmailValidate[];
}

export class SubScriptionPlan {
    Id: number;
    Name: string;
    CreatedOn: Date;
    UpdatedOn: Date;
    IsDeleted: boolean;
    SubscriptionPlanDetail: SubScriptionPlanDetail;
}

export class SubScriptionPlanDetail {
    Id: number;
    SubscriptionPlan: number;
    Agents: string;
    TrialPeriod: number;
    Price: string;
    FirstPrice: string;
    SecondPrice: string;
    IsListingReferrals: boolean;
    IsSalesLeadsAndTracking: boolean;
    IsMetricsAndAnalytics: boolean;
    IsReporting: boolean;
    IsFindAgentListing: boolean;
    IsRealtimeMarketUpdates: boolean;
    NetWorkDashboard: string;
    CreatedOn: Date;
    UpdatedOn: Date;
    IsDeleted: boolean;
}

export class IHomeCoockie {
    Id: string;
    ViewDate: string;
}

export class Option {
    Id: number;
    Value: number;
}

export class BillingPlan {
    Id: number;
    Name: string;
    Description: string;
    ReturnUrl: string;
    CancelUrl: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Amount: number;
    Currency: string;
    start_date: string;
  }

  export class Agreement {
    id: string;
    state: string;
    name: string;
    description: string;
    start_date: string;
    agreement_details: any;
    payer: any;
    shipping_address: any;
    override_merchant_preferences: any;
    override_charge_models: any;
    plan: any;
    create_time: string;
    update_time: string;
    token: string;
  }

  export class EmailValidate {
      Id: number;
      Email: string;
      Name: string;
      EmailValidMsg: string;
      IsEmailValid: boolean;
      CompanyName: string;
  }
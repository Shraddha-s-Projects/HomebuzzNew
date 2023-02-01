export class UserVM {
    UserId: number;
    UserName: string;
    Email: string;
    repeatemail: string;
    FirstName: string;
    LastName: string;
    Password: string;
    RepeatPassword: string;
    PhoneNo: string;
    Role: string;
    Entity: string;
    isTermsSelected: boolean;
    isPrivacySelected: boolean;
    inviteCode: string;
    IndustryRoleId: number = 0;
    IsCapchaVerified: boolean;
    IsPasswordMatchRule:boolean;
    Coockie: string;
    PropertyDetailIds: number[];
    File: any;
    // Homes: IHomeCoockie[];
}
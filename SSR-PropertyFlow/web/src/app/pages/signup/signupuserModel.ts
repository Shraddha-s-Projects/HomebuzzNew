export class signupuserModel {
    userName: string;
    email: string;
    repeatemail: string;
    firstName: string;
    lastName: string;
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
    IsPasswordMatchRule:boolean;
    Coockie: string;
    PropertyDetailIds: number[];
    Homes: IHomeCoockie[];
}

export class IHomeCoockie {
    Id: string;
    ViewDate: string;
}
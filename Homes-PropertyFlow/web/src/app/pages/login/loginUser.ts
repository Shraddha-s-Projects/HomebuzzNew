export class loginUser {
    Username: string;
    Password: string;
    Message: string;
    PasswordHash: string;
    coockie: Object;
    PropertyDetailIds: number[];
    Homes: IHomeCoockie[];
    UserId: number;
}

export class IHomeCoockie {
    Id: string;
    ViewDate: string;
}

export class LoggedInUser {
    UserName: string;
    UserId: any;
    Role: string;
    Entity: string;
    Rights: string;
    IsSignUpFinished: boolean;
}

export class UserLoginDetail {
    UserId: number;
    LoginTime: Date;
    LogoutTime: Date;
    Ip: string;
    UserAgent: string;
    Browser: string;
    BrowserVersion: string;
    Os: string;
    OsVersion: string;
}
export class UserVM {
    UserId: number;
    Email: string;
    PhoneNo: string;
    FirstName: string;
    LastName: string;
    UserName: string;
    Role: string;
    RoleId: number;
    CreatedOn: string;
    OrderColumnName: string;
    OrderColumnDir: string;
    PageNum: number;
    PageSize: number;
    IsActive: boolean;
    Skip: number;
    TotalCount: number;
    isEdit:boolean;
}

export class Status{
    Id: number;
    Name: string;
    IsActive: boolean;
}
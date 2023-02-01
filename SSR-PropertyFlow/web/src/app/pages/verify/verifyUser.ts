export class verifyUser
{
    IsVerified:boolean;
    IsAlreadyVerified:boolean;
    Message:string;
    VerificationCode:string;
    Hash:string;
    VerificationCodeHash:string;
    IsCodeHashVerified:boolean;
    IsVerificationCodeValid:boolean = true;
    IsVerificationCodeUsed:boolean;
    ResetPasswordLink: string;
}

export class CreatePassword{
    Hash:string;
    NewPassword:string;
    NewPasswordRepeat:string;
    IsPasswordMatchRule:boolean;
    IsNewPasswordMatch:boolean;
    IsPasswordValid:boolean;
    ErrorMessage:string;
}
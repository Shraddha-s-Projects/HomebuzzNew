namespace HomeBuzz.data.ViewModels {
    using System.Collections.Generic;
    using System;
    using HomeBuzz.data.Models.ViewModels;
    using HomeBuzz.data;
    using Microsoft.AspNetCore.Http;

    public class UserVM {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNo { get; set; }
        public string InviteCode { get; set; }
        public string Entity { get; set; }
        public string ProfilePicPath { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public int? Company { get; set; }
        public long DateFormatId { get; set; }
        public string OrderColumnName { get; set; }
        public string OrderColumnDir { get; set; }
        public bool IsUserAlreadyExist { get; set; }
        public bool IsCompanyAlreadyExist { get; set; }
        public bool IsEmailValid { get; set; } = true;
        public int PageNum { get; set; }
        public int PageSize { get; set; }
        public int RoleId { get; set; }
        public string Role { get; set; }
        public bool IsSuccessSignUp { get; set; }
        public string Coockie { get; set; }
        public string[] PropertyDetailIds { get; set; }
        public List<HomeCoockie> Homes { get; set; }
        public int? NoOfAgent { get; set; }
        public SubscriptionPlanVM SubscriptionPlan { get; set; }
        public decimal? TotalPrice { get; set; }
        public string PlanId { get; set; }
        public string AgreementId { get; set; }
        public string State { get; set; }
        public string Token { get; set; }
        public List<AgentEmail> AgentEmails { get; set; }
        public string phone { get; set; }
        public IFormFile File { get; set; }
        public bool IsCompanyEmailAlreadyExist { get; set; }
        public bool IsCompanyNameAlreadyExist { get; set; }
        public bool IsCompanyPhoneNoAlreadyExist { get; set; }
    }

    public class AgentEmail {
        public string Email { get; set; }
    }

    public class EmailValidateVM {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string EmailValidMsg { get; set; }
        public string CompanyName { get; set; }
        public bool IsEmailValid { get; set; } = true;

    }

    public class HomeCoockie {

        public string Id { get; set; }

        public string ViewDate { get; set; }

        public string UserKey { get; set; }
    }

    public class AddUpdateHomeCoockie {
        public long UserId { get; set; }
        public List<HomeCoockie> Homes { get; set; }
    }

    public class UpdatePropertyViewUserIdModel {
        public long UserId { get; set; }
        public string UserKey { get; set; }
    }
    public class Recapcha {
        public string response { get; set; }

        public string secret { get; set; }

        public string remoteip { get; set; }

        public string success { get; set; }

        public DateTime challenge_ts { get; set; }

        public string hostname { get; set; }
    }

    public class CreatePassword {
        public string Hash { get; set; }

        public string NewPassword { get; set; }

        public string NewPasswordRepeat { get; set; }

        public bool IsPasswordMatchRule { get; set; } = true;

        public bool IsNewPasswordMatch { get; set; } = true;

        public bool IsPasswordValid { get; set; } = true;

        public string ErrorMessage { get; set; }

        public string Email { get; set; }
    }

    public class ResetPassword {
        public string Email { get; set; }

        public bool IsEmailValid { get; set; }

        public string EmailErrorMessage { get; set; }

        public bool IsCapchaVerified { get; set; }
    }

    public class CommonResponse {
        public bool IsValid { get; set; }

        public string ErrorMessage { get; set; }
    }

    public class AdminUserVM {
        public long UserId { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public int AgentAdminId { get; set; }
        public string Role { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool? IsActive { get; set; }
        public string OrderColumnName { get; set; }
        public string OrderColumnDir { get; set; }
        public int PageNum { get; set; }
        public int PageSize { get; set; }
        public long TotalCount { get; set; }
    }
}
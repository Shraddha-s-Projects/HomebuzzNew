namespace HomeBuzz.logic.Common {
    public static class CommonMessage {
        public static string CurrentURL { get; set; }
        public static string AppURL { get; set; }
        public static string DefaultErrorMessage { get; set; } = "An error occurred while processing your request";
        public static string EmailOrPhoneNoExist { get; set; } = "Email or phone no already exist";
        public static string EmailExist { get; set; } = "Company email already exist";
        public static string PhoneNoExist { get; set; } = "Company phone no already exist";
        public static string CompanyNameExist { get; set; } = "Company name already exist";
        public static string SignupMsg { get; set; } = "Thanks for signing up. Please check your email for verification link and login credentials";
        public static string RegisteredEmail { get; set; } = "Please enter registered email";
        public static string SuccessMsg { get; set; } = "Saved successfully";
        public static string DataSuccessMsg { get; set; } = "Data saved successfully";
        public static string SomethingWentWrong { get; set; } = "Something went wrong. Please refresh the page or try again later";
        public static string CodeSent { get; set; } = "Verification code has been sent to {0}";
        public static string InvalidVerificationCode { get; set; } = "Verification code does not match";
        public static string UnAuthorizedUser { get; set; } = "Request not authorized";
        public static string PasswordUpdated { get; set; } = "Password has been updated successfully";
        public static string InvalidPassword { get; set; } = "New password does not follow the rule";
        public static string InvalidRequest { get; set; } = "Invalid Request";
        public static string SuccessEmailVerified { get; set; } = "Congratulations! You have successfully verified [email]. Please login with provided credentials in email";
        public static string SuccessEmailAlreadyVerified { get; set; } = "Email has already verified";
        public static string VerificationCodeInvalid { get; set; } = "Either verification code has expired or invalid";
        public static string EmailAuthorizedSuccessMsg { get; set; } = "Account authorized successfully";
        public static string InvalidLoginRequest { get; set; } = "Invalid login request";
        public static string AccountChange { get; set; } = "Please wait while we are authenticating {0}'s Account";
        public static string AlReadyClaimedHome { get; set; } = "This property is already claimed";
        public static string AlReadyListProperty { get; set; } = "This property is already listed";
    }
}
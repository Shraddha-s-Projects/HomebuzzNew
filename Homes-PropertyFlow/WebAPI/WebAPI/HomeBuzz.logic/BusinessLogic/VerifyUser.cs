using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.helper;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Hosting;

namespace HomeBuzz.logic {
    public class VerifyUser {
        #region Property Initialization
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly IVerificationCodeService _verificationCodeService;
        private readonly ICompanyService _companyService;
        private readonly IUserRolesService _userRoleService;
        private SendEmail sendEmail;
        private ErrorLogService errorlogservice;
        #endregion

        #region Constructor
        public VerifyUser (IUserService userService,
            IEmailTemplateService emailTemplateService,
            IVerificationCodeService verificationCodeService,
            ICompanyService companyService,
            IUserRolesService userRolesService,
            HomeBuzzContext context) {
            _userService = userService;
            _emailTemplateService = emailTemplateService;
            _verificationCodeService = verificationCodeService;
            _companyService = companyService;
            _userRoleService = userRolesService;
            errorlogservice = new ErrorLogService (context);
            sendEmail = new SendEmail (emailTemplateService);
        }
        #endregion

        #region Set Function
        public async Task<VerifyUserVM> VerifyUserByVerificationCode (VerifyUserVM model) {
            var task = new List<Task> ();
            var verificationCode = (dynamic) null;
            var user = _userService.GetUserByEmailHash (model.Hash);
            model.IsCodeHashVerified = false;
            model.NotificationVM = new NotificationVM ();
            string verificationFor = "";

            // Set User Details
            if (user != null) {
                // Check is verification code has verified
                // User made password reset request
                if (!string.IsNullOrEmpty (model.VerificationCodeHash)) {
                    verificationCode = _verificationCodeService.GetVerificationCodeByHash (model.VerificationCodeHash, user.UserId);
                    if (verificationCode == null || (verificationCode != null && verificationCode.Code != model.VerificationCode)) {
                        model.IsVerified = false;
                        model.IsAlreadyVerified = false;
                        model.IsVerificationCodeValid = false;
                        model.Message = CommonMessage.VerificationCodeInvalid;
                        return model;
                    }

                    // Means user is being verified for password reset request
                    model.IsCodeHashVerified = true;
                    verificationFor = verificationCode.VerificationFor;
                }

                // Check if email has already verificied or not 
                // User has already signup & verified their email and trying to verify email again
                if (user.IsEmailVerified && !model.IsCodeHashVerified) {
                    model.IsVerified = false;
                    model.IsAlreadyVerified = true;
                    model.Message = CommonMessage.SuccessEmailAlreadyVerified;
                    return model;
                }

                // User is signup recently and verifying their email for the first time
                if (!string.IsNullOrEmpty (model.VerificationCode) && !model.IsCodeHashVerified) {
                    verificationCode = _verificationCodeService.GetVerificationCodeDetailByUserId (model.VerificationCode, user.UserId, DataUtility.VerificationCodeType.PasswordReset.ToString ());
                }

                // Check verification code is valid
                if (verificationCode == null || verificationCode.ExpiredOn < Utility.GetCurrentDateTime () || verificationCode.IsUsed) {
                    model.IsVerified = false;
                    model.IsVerificationCodeValid = false;
                    model.Message = CommonMessage.VerificationCodeInvalid;
                    return model;
                } else {
                    // Update verification code as used
                    verificationCode.IsUsed = true;
                    verificationCode.UpdatedOn = Utility.GetCurrentDateTime ();
                    _verificationCodeService.CheckInsertOrUpdate (verificationCode);
                }

                user.IsActive = true;
                user.IsEmailVerified = true;
                user.EmailVerifiedOn = Utility.GetCurrentDateTime ();
                _userService.UpdateAsync (user, Convert.ToInt32 (user.UserId));
                _userService.SaveAsync ();
                model.IsVerified = true;
                model.Message = CommonMessage.SuccessEmailVerified.Replace ("[email]", user.Email);

                // Send email verified notification email
                try {
                    if (!model.IsCodeHashVerified) {
                        task.Add (sendEmail.SendEmailVerifiedNotification (user.Email, user.FirstName + ' ' + user.LastName));
                        var code = Utility.VerificationCode ();
                        var AgentRoleId = _userRoleService.GetUserRoleByName("Agent").Id;
                        var AgentAdminRoleId = _userRoleService.GetUserRoleByName("Agent_Admin").Id;
                        if (user.RoleId == AgentRoleId || user.RoleId == AgentAdminRoleId) {
                            // model.ResetPasswordLink =  HomeBuzzContext.AppURL + "verify/account/" + ShaHash.GetHash (code) + "/" + ShaHash.GetHash (user.Email);
                            model.ResetPasswordLink = "verify/account/" + ShaHash.GetHash (code) + "/" + ShaHash.GetHash (user.Email);
                            model.IsVerified = true;
                        }

                        if (user.Company != null) {
                            var companyObj = _companyService.GetCompanyById (user.Company.Value);
                            if (companyObj != null)
                                task.Add (sendEmail.SendEmailToCompanyAgentVerifiedAccount (companyObj.Email, companyObj.Name, user.Email));
                        }
                    }

                } catch (Exception ex) {
                    errorlogservice.LogException (ex);
                }

                await Task.WhenAll (task);
                model.UserId = user.UserId;
            }
            return model;
        }

        public async Task<VerifyUserVM> IsEmailAlreadyVerified (VerifyUserVM model) {
            var user = _userService.GetUserByEmailHash (model.Hash);
            if (user != null) {
                // Check is email already verificied or not
                if (user.IsEmailVerified) {
                    model.IsVerified = false;
                    model.IsAlreadyVerified = true;
                    model.Message = CommonMessage.SuccessEmailAlreadyVerified;
                    return model;
                }
            }

            return model;
        }
        #endregion
    }
}
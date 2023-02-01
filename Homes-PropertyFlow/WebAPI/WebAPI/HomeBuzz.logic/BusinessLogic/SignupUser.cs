using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.helper;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace HomeBuzz.logic {
    public class SignupUser {
        #region Property Initialization
        private readonly IUserService _userService;
        private readonly IVerificationCodeService _verificationCodeService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly IPropertyViewService _propertyViewService;
        private readonly ICompanyService _companyService;
        private readonly IAgentPaymentService _agentPaymentService;
        private readonly IUserRolesService _userRoleService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private SendEmail sendEmail;

        private ErrorLogService errorlogservice;
        #endregion

        #region Constructor
        public SignupUser (IUserService userService,
            IEmailTemplateService emailTemplateService,
            IVerificationCodeService verificationCodeService,
            IPropertyViewService propertyViewService,
            ICompanyService companyService,
            IAgentPaymentService agentPaymentService,
            IUserRolesService userRoleService,
            HomeBuzzContext context) {
            _userService = userService;
            _verificationCodeService = verificationCodeService;
            _emailTemplateService = emailTemplateService;
            _propertyViewService = propertyViewService;
            _companyService = companyService;
            _agentPaymentService = agentPaymentService;
            _userRoleService = userRoleService;
            errorlogservice = new ErrorLogService (context);
            sendEmail = new SendEmail (emailTemplateService);
        }
        #endregion

        #region 'Get Function'

        #endregion

        #region 'Set Function'
        public async Task<UserVM> ProcessUserSignup (UserVM model) {
            var user = new User ();
            IFormatProvider culture = new CultureInfo ("en-US", true);

            // Check if email already registered in the system
            var ExistsUser = _userService.GetUserByEmail (model.Email);
            if (ExistsUser != null) {
                model.IsUserAlreadyExist = true;
                model.IsSuccessSignUp = false;
                return model;
            } else {
                // Check email is valid or not
                if (!Utility.IsValidEmail (model.Email)) {
                    model.IsEmailValid = false;
                    model.IsSuccessSignUp = false;
                    return model;
                }

                // Set and insert new user
                user.UserName = model.Email.Trim ();
                user.UserGUID = Guid.NewGuid ();
                user.Email = model.Email.Trim ();
                user.Password = ShaHash.GetHash (model.Password);
                user.CreatedOn = Utility.GetCurrentDateTime ();
                user.FirstName = string.IsNullOrEmpty (model.FirstName) ? null : Utility.ToTitleCase (model.FirstName);
                user.LastName = string.IsNullOrEmpty (model.LastName) ? null : Utility.ToTitleCase (model.LastName);
                user.RoleId = model.RoleId;
                user = _userService.Add (user);
                _userService.SaveAsync ();

                model.IsSuccessSignUp = true;

                // Set verification Code
                var verificationCode = new VerificationCode ();
                var code = Utility.VerificationCode ();
                verificationCode.UserId = user.UserId;
                verificationCode.Email = user.Email;
                verificationCode.Code = code;
                verificationCode.IsUsed = false;
                verificationCode.CreatedOn = DataUtility.GetCurrentDateTime ();
                verificationCode.ExpiredOn = Utility.VerificationCodeExpiredOn ();
                verificationCode.VerificationFor = DataUtility.VerificationCodeType.SignupEmail.ToString ();
                verificationCode = _verificationCodeService.CheckInsertOrUpdate (verificationCode);

                // add Property View

                List<PropertyViewListVM> propertyVMList = new List<PropertyViewListVM> ();
                if (model.Homes != null) {
                    foreach (var item in model.Homes) {
                        PropertyViewListVM propertyvm = new PropertyViewListVM ();
                        propertyvm.PropertyDetailId = Convert.ToInt32 (item.Id);
                        propertyvm.ViewDate = DateTime.ParseExact (item.ViewDate, "mm/dd/yyyy", culture);
                        propertyvm.UserId = Convert.ToInt16 (user.UserId);
                        propertyVMList.Add (propertyvm);
                    }
                }

                if (propertyVMList.Count > 0) {
                    var result = _propertyViewService.CheckInsertOrUpdatePropertyView (propertyVMList);
                }

                // if (model.PropertyDetailIds != null) {
                //     PropertyViewVM propertyvm = new PropertyViewVM ();
                //     propertyvm.UserId = user.UserId;
                //     propertyvm.PropertyDetailId = model.PropertyDetailIds;
                //     var result = _propertyViewService.CheckInsertOrUpdate (propertyvm);
                // }
                model.Id = user.UserId;
                try {
                    // Send sign up confirmation email with credentials
                    await sendEmail.SendSignUpEmail (model.Email, ShaHash.GetHash (user.Email), user.FirstName + ' ' + user.LastName, code);
                } catch (Exception ex) {
                    // errorlogservice.LogException (ex);
                    throw;
                }

            }

            return model;
        }

        public async Task<CreatePassword> CreateNewPassword (CreatePassword model) {
            var user = _userService.GetUserByEmailHash (model.Hash);
            if (user != null) {
                //if (!IsValidSecuritySetting(ref model))
                //{
                //    model.IsPasswordValid = false;
                //    model.ErrorMessage = CommonMessage.InvalidPassword;
                //    return model;
                //}

                // Add password change history
                var userPasswordHistory = new UserPasswordHistory ();
                userPasswordHistory.Email = user.Email;
                userPasswordHistory.UserId = user.UserId;
                userPasswordHistory.CreatedOn = Utility.GetCurrentDateTime ();
                userPasswordHistory.Password = user.Password;

                // Update password
                user.Password = model.NewPassword;
                _userService.CheckAndUpdate (user);
                model.IsPasswordValid = true;
                model.Email = user.Email;
                model.ErrorMessage = CommonMessage.PasswordUpdated;

                // try {
                //     // Send password reset email
                //     //await sendEmail.PasswordChangeNotification(user.Email, user.FirstName + ' ' + user.LastName);
                // } catch (Exception ex) {

                //     throw;
                // }

            } else {
                model.IsPasswordValid = false;
                model.ErrorMessage = CommonMessage.UnAuthorizedUser;
            }
            return model;
        }

        public async Task<ResetPassword> ResetPassword (ResetPassword model) {
            var user = _userService.GetUserByEmail (model.Email);
            if (user != null) {
                // Set verification Code
                var verificationCode = new VerificationCode ();
                var code = Utility.VerificationCode ();
                verificationCode.UserId = user.UserId;
                verificationCode.Email = user.Email;
                verificationCode.Code = code;
                verificationCode.IsUsed = false;
                verificationCode.CreatedOn = DataUtility.GetCurrentDateTime ();
                verificationCode.ExpiredOn = Utility.VerificationCodeExpiredOn ();
                verificationCode.VerificationFor = DataUtility.VerificationCodeType.PasswordReset.ToString ();
                verificationCode = _verificationCodeService.CheckInsertOrUpdate (verificationCode);

                // Send verification code email
                try {
                    await sendEmail.SendPasswordResetEmail (user.Email, user.FirstName + ' ' + user.LastName, code);
                } catch (Exception ex) {
                    // errorlogservice.LogException (ex);
                    throw;
                }
            } else {
                model.IsEmailValid = false;
                model.EmailErrorMessage = CommonMessage.UnAuthorizedUser;
            }

            return model;
        }

        public async Task<PropertyClaimVM> ClaimHome (PropertyClaimVM model) {
            var user = _userService.GetUserByUserId (model.OwnerId.Value);
            if (user != null) {

                // Send verification code email
                try {
                    await sendEmail.SendClaimEmail (user.Email, model.Address);
                } catch (Exception ex) {
                    // errorlogservice.LogException (ex);
                    throw;
                }
            } else {
                model.IsEmailValid = false;
                model.EmailErrorMessage = CommonMessage.UnAuthorizedUser;
            }

            return model;
        }

        public async Task<PropertyClaimVM> RemoveClaimHome (PropertyClaimVM model) {
            var user = _userService.GetUserByUserId (model.OwnerId.Value);
            if (user != null) {

                // Send verification code email
                try {
                    await sendEmail.SendRemoveClaimEmail (user.Email, model.Address);
                } catch (Exception ex) {
                    // errorlogservice.LogException (ex);
                    throw;
                }
            } else {
                model.IsEmailValid = false;
                model.EmailErrorMessage = CommonMessage.UnAuthorizedUser;
            }

            return model;
        }

        public async Task<PropertyClaimVM> RenewClaimHome (PropertyClaimVM model) {
            var user = _userService.GetUserByUserId (model.OwnerId.Value);
            if (user != null) {

                // Send verification code email
                try {
                    await sendEmail.SendRenewClaimEmail (user.Email, model.Address);
                } catch (Exception ex) {
                    // errorlogservice.LogException (ex);
                    throw;
                }
            } else {
                model.IsEmailValid = false;
                model.EmailErrorMessage = CommonMessage.UnAuthorizedUser;
            }

            return model;
        }

        public async Task<PropertyOwnershipHistoryVM> TransferPropertyOwner (PropertyOwnershipHistoryVM model) {
            var user = _userService.GetUserByUserId (model.ToOwnerId.Value);
            if (user != null) {

                // Send verification code email
                try {
                    await sendEmail.TransferPropertyClaimEmail (user.Email, model.Address);
                } catch (Exception ex) {
                    // errorlogservice.LogException (ex);
                    throw;
                }
            } else {
                model.IsEmailValid = false;
                model.EmailErrorMessage = CommonMessage.UnAuthorizedUser;
            }

            return model;
        }

        public async Task<UserVM> ProcessAgentSignup (UserVM model) {
            IFormatProvider culture = new CultureInfo ("en-US", true);
            var ExistsCompany = _companyService.GetCompanyByEmail (model.Email);
            if (ExistsCompany != null) {
                model.IsCompanyEmailAlreadyExist = true;
                model.IsSuccessSignUp = false;
                return model;
            }
            ExistsCompany = _companyService.GetCompanyByName (model.CompanyName);
            if (ExistsCompany != null) {
                model.IsCompanyNameAlreadyExist = true;
                model.IsSuccessSignUp = false;
                return model;
            }
            ExistsCompany = _companyService.GetCompanyByPhoneNo (model.phone);
            if (ExistsCompany != null) {
                model.IsCompanyPhoneNoAlreadyExist = true;
                model.IsSuccessSignUp = false;
                return model;
            }
            foreach (var item in model.AgentEmails) {
                var ExistsUser = _userService.GetUserByEmail (item.Email);
                if (ExistsUser != null) {
                    model.IsUserAlreadyExist = true;
                    model.IsSuccessSignUp = false;
                    return model;
                }
            }
            // Check email is valid or not
            if (!Utility.IsValidEmail (model.Email)) {
                model.IsEmailValid = false;
                model.IsSuccessSignUp = false;
                return model;
            }
            var AgentAdminRoleId = _userRoleService.GetUserRoleByName ("Agent_Admin").Id;
            var AgentRoleId = _userRoleService.GetUserRoleByName ("Agent").Id;
            if (model.SubscriptionPlan != null && model.SubscriptionPlan.Id > 1) {
                // Add company for multiple agents
                Company companyObj = new Company ();
                companyObj.Name = model.CompanyName;
                companyObj.Email = model.Email;
                companyObj.PhoneNo = model.phone;
                var AddedCompany = _companyService.CheckInsertOrUpdate (companyObj);

                // Add agent payment for multiple agents company
                AgentPayment agentPayment = new AgentPayment ();
                if (AddedCompany != null) {
                    agentPayment.Company = AddedCompany.Id;
                }
                agentPayment.BillingPlan = model.PlanId;
                agentPayment.BillingAgreement = model.AgreementId;
                agentPayment.State = model.State;
                agentPayment.Token = model.Token;
                var AddedAgentPayment = _agentPaymentService.CheckInsertOrUpdate (agentPayment);

                for (int i = 0; i < model.AgentEmails.Count; i++) {
                    // Set and insert new user
                    var user = new User ();
                    user.UserName = model.CompanyName + (i + 1);
                    user.UserGUID = Guid.NewGuid ();
                    user.Email = model.AgentEmails[i].Email.Trim ();
                    user.Password = ShaHash.GetHash (model.CompanyName + (i + 1) + "@123");
                    user.CreatedOn = Utility.GetCurrentDateTime ();
                    user.FirstName = string.IsNullOrEmpty (user.UserName) ? null : Utility.ToTitleCase (user.UserName);
                    // user.LastName = string.IsNullOrEmpty (model.LastName) ? null : Utility.ToTitleCase (model.LastName);
                    if (AddedCompany != null) {
                        user.Company = AddedCompany.Id;
                    }
                    if (i == 0) {
                        user.RoleId = AgentAdminRoleId;
                    } else {
                        user.RoleId = AgentRoleId;
                    }

                    user.SubscriptionPlan = model.SubscriptionPlan.Id;
                    user = _userService.Add (user);
                    _userService.SaveAsync ();

                    // Set verification Code
                    var verificationCode = new VerificationCode ();
                    var code = Utility.VerificationCode ();
                    verificationCode.UserId = user.UserId;
                    verificationCode.Email = user.Email;
                    verificationCode.Code = code;
                    verificationCode.IsUsed = false;
                    verificationCode.CreatedOn = DataUtility.GetCurrentDateTime ();
                    verificationCode.ExpiredOn = Utility.VerificationCodeExpiredOn ();
                    verificationCode.VerificationFor = DataUtility.VerificationCodeType.SignupEmail.ToString ();
                    verificationCode = _verificationCodeService.CheckInsertOrUpdate (verificationCode);

                    if (user.RoleId == AgentAdminRoleId) {
                        List<PropertyViewListVM> propertyVMList = new List<PropertyViewListVM> ();
                        if (model.Homes != null) {
                            foreach (var item in model.Homes) {
                                PropertyViewListVM propertyvm = new PropertyViewListVM ();
                                propertyvm.PropertyDetailId = Convert.ToInt32 (item.Id);
                                propertyvm.ViewDate = DateTime.ParseExact (item.ViewDate, "mm/dd/yyyy", culture);
                                propertyvm.UserId = Convert.ToInt16 (user.UserId);
                                propertyVMList.Add (propertyvm);
                            }

                            // add Property View for Agent Admin
                            if (propertyVMList.Count > 0) {
                                var result = _propertyViewService.CheckInsertOrUpdatePropertyView (propertyVMList);
                            }
                        }
                    }

                    await sendEmail.SendSignUpEmail (user.Email, ShaHash.GetHash (user.Email), user.FirstName + ' ' + user.LastName, code);
                }
            } else {

                Company companyObj = new Company ();
                companyObj.Name = model.CompanyName;
                // companyObj.Email = model.Email;
                companyObj.PhoneNo = model.phone;
                var AddedCompany = _companyService.CheckInsertOrUpdate (companyObj);

                // Set and insert new user
                var user = new User ();
                user.UserName = model.Email.Trim ();
                user.UserGUID = Guid.NewGuid ();
                user.Email = model.Email.Trim ();
                user.Password = ShaHash.GetHash (model.UserName + "@123");
                user.CreatedOn = Utility.GetCurrentDateTime ();
                user.FirstName = string.IsNullOrEmpty (model.UserName) ? null : Utility.ToTitleCase (model.UserName);
                // user.LastName = string.IsNullOrEmpty (model.LastName) ? null : Utility.ToTitleCase (model.LastName);
                user.RoleId = AgentRoleId;
                user.SubscriptionPlan = model.SubscriptionPlan.Id;
                user.Company = AddedCompany.Id;
                user = _userService.Add (user);
                _userService.SaveAsync ();

                // Add agent payment for single agent
                AgentPayment agentPayment = new AgentPayment ();
                agentPayment.User = user.UserId;
                agentPayment.Company = AddedCompany.Id;
                agentPayment.BillingPlan = model.PlanId;
                agentPayment.BillingAgreement = model.AgreementId;
                agentPayment.State = model.State;
                agentPayment.Token = model.Token;
                var AddedAgentPayment = _agentPaymentService.CheckInsertOrUpdate (agentPayment);

                // Set verification Code
                var verificationCode = new VerificationCode ();
                var code = Utility.VerificationCode ();
                verificationCode.UserId = user.UserId;
                verificationCode.Email = user.Email;
                verificationCode.Code = code;
                verificationCode.IsUsed = false;
                verificationCode.CreatedOn = DataUtility.GetCurrentDateTime ();
                verificationCode.ExpiredOn = Utility.VerificationCodeExpiredOn ();
                verificationCode.VerificationFor = DataUtility.VerificationCodeType.SignupEmail.ToString ();
                verificationCode = _verificationCodeService.CheckInsertOrUpdate (verificationCode);

                List<PropertyViewListVM> propertyVMList = new List<PropertyViewListVM> ();
                if (model.Homes != null) {
                    foreach (var item in model.Homes) {
                        PropertyViewListVM propertyvm = new PropertyViewListVM ();
                        propertyvm.PropertyDetailId = Convert.ToInt32 (item.Id);
                        propertyvm.ViewDate = DateTime.ParseExact (item.ViewDate, "mm/dd/yyyy", culture);
                        propertyvm.UserId = Convert.ToInt16 (user.UserId);
                        propertyVMList.Add (propertyvm);
                    }

                    // add Property View for single agent
                    if (propertyVMList.Count > 0) {
                        var result = _propertyViewService.CheckInsertOrUpdatePropertyView (propertyVMList);
                    }
                }
                await sendEmail.SendSignUpEmail (user.Email, ShaHash.GetHash (user.Email), user.FirstName + ' ' + user.LastName, code);
            }

            model.IsSuccessSignUp = true;

            // model.Id = user.UserId;
            try {
                // Send sign up confirmation email with credentials
                if (model.SubscriptionPlan != null && model.SubscriptionPlan.Id > 1) {
                    await sendEmail.SendAgentCompanyEmail (model);
                }

            } catch (Exception ex) {
                // errorlogservice.LogException (ex);
                throw ex;
            }

            return model;
        }

        public async Task<OperationResult<string>> UploadProfilePic (IFormFile file, long UserId) {
            PropertyImage AddOrUpdate = new PropertyImage ();
            List<PropertyImage> PropImageList = new List<PropertyImage> ();
            try {
                if (file == null) throw new Exception ("File is null");
                if (file.Length == 0) throw new Exception ("File is empty");

                // foreach (IFormFile file in fileList) {
                // full path to file in temp location
                var dirPath = _hostingEnvironment.WebRootPath + "\\Upload\\UserProfileImages";

                if (!Directory.Exists (dirPath)) {
                    Directory.CreateDirectory (dirPath);
                }

                var fileName = string.Concat (
                    Path.GetFileNameWithoutExtension (file.FileName),
                    DateTime.Now.ToString ("yyyyMMdd_HHmmss"),
                    Path.GetExtension (file.FileName)
                );
                var filePath = dirPath + "\\" + fileName;

                using (var oStream = new FileStream (filePath, FileMode.Create, FileAccess.ReadWrite)) {
                    await file.CopyToAsync (oStream);
                }

                var user = _userService.GetUserByUserId (UserId);
                // user.ProfilePicPath = fileName;
                // await _userService.UpdateAsync (user, user.UserId);
                // _userService.SaveAsync ();
                return new OperationResult<string> (true, "", fileName);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<string> (false, CommonMessage.DefaultErrorMessage);
            }
        }
        #endregion
    }

}
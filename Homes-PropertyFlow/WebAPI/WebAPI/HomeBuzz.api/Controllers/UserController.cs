using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.helper;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using WebSocketManager;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/User")]
    public class UserController : Controller {
        #region 'Property Initializer'

        private readonly IUserService _userService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private SignupUser signupUser;
        private readonly IPropertyViewService _propertyViewService;
        private readonly ICompanyService _companyService;
        private readonly IAgentPaymentService _agentPaymentService;
        private readonly IUserRolesService _userRoleService;
        //private SetupWizard setupWizard;
        //private UserCommon userCommon;
        private ErrorLogService errorlogservice;
        private long userId;

        #endregion

        #region 'Constructor'
        public UserController (IUserService userService, HomeBuzzContext context, IHostingEnvironment hostingEnvironment, IEmailTemplateService emailTemplateService, IVerificationCodeService verificationCodeService,
            IPropertyViewService propertyViewService,
            ICompanyService companyService,
            IAgentPaymentService agentPaymentService,
            IUserRolesService userRoleService) {
            _userService = userService;
            _userRoleService = userRoleService;
            _hostingEnvironment = hostingEnvironment;
            errorlogservice = new ErrorLogService (context);
            _propertyViewService = propertyViewService;
            signupUser = new SignupUser (userService, emailTemplateService, verificationCodeService, propertyViewService, companyService, agentPaymentService, userRoleService, context);
        }
        #endregion

        #region 'User Setup'
        /// <summary>
        /// This API called when user do sign up.
        /// </summary>
        /// <param name="Model"> User Model</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost ("Signup")]
        public async Task<OperationResult<UserVM>> Signup ([FromBody] UserVM Model) {
            try {
                var CustomerRole = _userRoleService.GetUserRoleByName ("Customer");
                if (CustomerRole != null) {
                    Model.RoleId = CustomerRole.Id;
                } else {
                    Model.RoleId = 1;
                }
                if (Model.Coockie != "" && Model.Coockie != null) {
                    Model.PropertyDetailIds = Model.Coockie.Split (",");
                }
                var result = await signupUser.ProcessUserSignup (Model);

                return new OperationResult<UserVM> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<UserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("CreateNewPassword")]
        public async Task<OperationResult<CreatePassword>> CreateNewPassword ([FromBody] CreatePassword model) {
            try {
                if (model != null && !string.IsNullOrEmpty (model.Hash) && !string.IsNullOrEmpty (model.NewPassword) && !string.IsNullOrEmpty (model.NewPasswordRepeat)) {
                    var result = await signupUser.CreateNewPassword (model);
                    return new OperationResult<CreatePassword> (result.IsPasswordValid, result.ErrorMessage, result);
                } else {
                    return new OperationResult<CreatePassword> (false, CommonMessage.SomethingWentWrong);
                }
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<CreatePassword> (false, CommonMessage.DefaultErrorMessage);
            }

        }

        /// <summary>
        /// This API called for Reser Password
        /// </summary>
        /// <param name="Email">Email</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost ("ResetPassword")]
        public async Task<OperationResult<ResetPassword>> ResetPassword ([FromBody] ResetPassword model) {
            try {
                if (model != null) {
                    var result = await signupUser.ResetPassword (model);
                    return new OperationResult<ResetPassword> (result.IsEmailValid, result.EmailErrorMessage, result);
                } else {
                    return new OperationResult<ResetPassword> (false, CommonMessage.SomethingWentWrong);
                }
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<ResetPassword> (false, CommonMessage.DefaultErrorMessage);
            }
        }
        #endregion

        [HttpGet ("GetUser")]
        public async Task<OperationResult<User>> GetUser (int UserId) {
            try {
                var user = _userService.GetUserByUserId (Convert.ToInt64 (UserId));
                if (user == null) {
                    user = new User ();
                }

                return new OperationResult<User> (true, "", user);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<User> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("Update")]
        // public async Task<OperationResult<User>> Update ([FromForm] UserVM Model) {
        public async Task<OperationResult<UserVM>> Update ([FromBody] UserVM Model) {
            try {
                var ExistingUser = _userService.IsEmailCheckWithOtherUsers (Model.Email, Model.UserId);
                if (Model.PhoneNo != null && Model.PhoneNo != "") {
                    ExistingUser = _userService.IsPhoneNoCheckWithOtherUsers (Model.PhoneNo, Model.UserId);
                }
                if (ExistingUser == null) {
                    User userObj = new User ();
                    userObj.UserId = Model.UserId;
                    userObj.FirstName = Model.FirstName;
                    userObj.LastName = Model.LastName;
                    userObj.UserName = Model.UserName;
                    userObj.Email = Model.Email;
                    userObj.PhoneNo = Model.PhoneNo;

                    if (Model.File != null) {
                        var filename = signupUser.UploadProfilePic (Model.File, Model.UserId);
                        userObj.ProfilePicPath = filename.ToString ();
                    }
                    var user = _userService.CheckAndUpdate (userObj);
                    return new OperationResult<UserVM> (true, "", Model);
                } else {
                    return new OperationResult<UserVM> (false, CommonMessage.EmailOrPhoneNoExist);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<UserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpGet ("GetAllUser")]
        public async Task<OperationResult<List<User>>> GetAllUser () {
            try {
                var userRole = _userRoleService.GetUserRoleByName ("Customer");
                if (userRole != null) {
                    var user = _userService.GetUsersByRoleId (userRole.Id);
                    return new OperationResult<List<User>> (true, "", user);
                } else {
                    return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpGet ("GetAllAgent")]
        public async Task<OperationResult<List<User>>> GetAllAgent () {
            try {
                var userRole = _userRoleService.GetUserRoleByName ("Agent");
                if (userRole != null) {
                    var user = _userService.GetUsersByRoleId (userRole.Id);
                    return new OperationResult<List<User>> (true, "", user);
                } else {
                    return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpGet ("GetAllAdmin")]
        public async Task<OperationResult<List<User>>> GetAllAdmin () {
            try {
                var userRole = _userRoleService.GetUserRoleByName ("Admin");
                if (userRole != null) {
                    var user = _userService.GetUsersByRoleId (userRole.Id);
                    return new OperationResult<List<User>> (true, "", user);
                } else {
                    return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpGet ("GetCompanyAgents")]
        public async Task<OperationResult<List<User>>> GetCompanyAgents (int CompanyId) {
            try {
                var user = _userService.GetAgentsByCompany (CompanyId);
                return new OperationResult<List<User>> (true, "", user);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<User>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
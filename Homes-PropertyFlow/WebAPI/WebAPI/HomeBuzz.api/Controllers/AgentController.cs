using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/Agent")]
    public class AgentController : Controller {
        private ErrorLogService errorlogservice;
        private readonly IAgentOptionService _agentOptionService;
        private readonly IPropertyAgentService _propertyAgentService;
        private readonly ICompanyService _companyService;
        private readonly IAgentPaymentService _agentPaymentService;
        private SignupUser signupUser;
        private readonly IUserService _userService;
        private readonly IUserRolesService _userRoleService;

        #region 'Constructor'
        public AgentController (HomeBuzzContext context, IAgentOptionService agentOptionService,
            IPropertyAgentService propertyAgentService,
            IUserService userService,
            IEmailTemplateService emailTemplateService,
            IVerificationCodeService verificationCodeService,
            IPropertyViewService propertyViewService,
            ICompanyService companyService,
            IAgentPaymentService agentPaymentService,
            IUserRolesService userRoleService
        ) {
            _agentOptionService = agentOptionService;
            _companyService = companyService;
            _userService = userService;
            _propertyAgentService = propertyAgentService;
            errorlogservice = new ErrorLogService (context);
            signupUser = new SignupUser (userService, emailTemplateService, verificationCodeService, propertyViewService, companyService, agentPaymentService, userRoleService, context);
        }
        #endregion

        [AllowAnonymous]
        [HttpPost ("Signup")]
        public async Task<OperationResult<UserVM>> Signup ([FromBody] UserVM Model) {
            try {
                // Model.RoleId = 2;
                // if (Model.Coockie != "" && Model.Coockie != null) {
                //     Model.PropertyDetailIds = Model.Coockie.Split (",");
                // }
                var result = await signupUser.ProcessAgentSignup (Model);
                if (!result.IsSuccessSignUp && result.IsCompanyAlreadyExist) {
                    return new OperationResult<UserVM> (false, CommonMessage.EmailOrPhoneNoExist);
                } else if (!result.IsSuccessSignUp && result.IsUserAlreadyExist) {
                    return new OperationResult<UserVM> (false, CommonMessage.EmailOrPhoneNoExist);
                } else if (!result.IsSuccessSignUp && result.IsCompanyEmailAlreadyExist) {
                    return new OperationResult<UserVM> (false, CommonMessage.EmailExist);
                } else if (!result.IsSuccessSignUp && result.IsCompanyNameAlreadyExist) {
                    return new OperationResult<UserVM> (false, CommonMessage.CompanyNameExist);
                } else if (!result.IsSuccessSignUp && result.IsCompanyPhoneNoAlreadyExist) {
                    return new OperationResult<UserVM> (false, CommonMessage.PhoneNoExist);
                } else {
                    return new OperationResult<UserVM> (true, "", Model);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<UserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpGet ("GetAllAgentOption")]
        public async Task<OperationResult<List<AgentOption>>> GetAllAgentOption () {
            try {
                var result = _agentOptionService.GetAllAgentOptions ();
                return new OperationResult<List<AgentOption>> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<AgentOption>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("GetAllAgentProperties")]
        public async Task<OperationResult<Property>> GetAllAgentProperties ([FromBody] PropertyAgentVM propertyAgentVM) {
            try {
                var result = _propertyAgentService.GetAllAgentProperties (propertyAgentVM);
                return new OperationResult<Property> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<Property> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("UpdateProperyAgent")]
        public async Task<OperationResult<PropertyAgent>> UpdateProperyAgent ([FromBody] PropertyAgentVM propertyAgentVM) {
            try {
                var propertyAgentObj = _propertyAgentService.GetPropertyAgentByDetailId (propertyAgentVM);
                propertyAgentObj.AgentOptionId = propertyAgentVM.AgentOptionId;
                propertyAgentObj.UpdatedOn = DataUtility.GetCurrentDateTime ();
                var result = await _propertyAgentService.UpdateAsync (propertyAgentObj, propertyAgentObj.Id);
                await _propertyAgentService.SaveAsync ();
                return new OperationResult<PropertyAgent> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertyAgent> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("AgentValidate")]
        public async Task<OperationResult<UserVM>> AgentValidate ([FromBody] UserVM Model) {
            try {
                bool IsError = false;
                var ExistUser = _userService.GetUserByEmail (Model.Email);
                if (ExistUser != null) {
                    Model.IsCompanyEmailAlreadyExist = true;
                    IsError = true;
                }
                var CompanyObj = _companyService.GetCompanyByEmail (Model.Email);
                if (CompanyObj != null) {
                    Model.IsCompanyEmailAlreadyExist = true;
                    IsError = true;
                }
                CompanyObj = _companyService.GetCompanyByPhoneNo (Model.phone);
                if (CompanyObj != null) {
                    Model.IsCompanyPhoneNoAlreadyExist = true;
                    IsError = true;
                }
                CompanyObj = _companyService.GetCompanyByName (Model.CompanyName);
                if (CompanyObj != null) {
                    Model.IsCompanyNameAlreadyExist = true;
                    IsError = true;
                }
                if (IsError == true) {
                    return new OperationResult<UserVM> (false, "", Model);
                } else {
                    return new OperationResult<UserVM> (true, "", Model);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<UserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("ValidateEmail")]
        public async Task<OperationResult<EmailValidateVM>> ValidateEmail ([FromBody] EmailValidateVM Model) {
            try {
                bool IsError = false;
                var ExistUser = _userService.GetUserByEmail (Model.Email);
                if (ExistUser != null) {
                    Model.EmailValidMsg = "Email already Exist.";
                    Model.IsEmailValid = false;
                    IsError = true;
                }
                var CompanyObj = _companyService.GetCompanyByEmail (Model.Email);
                if (CompanyObj != null) {
                    Model.EmailValidMsg = "Email already Exist.";
                    Model.IsEmailValid = false;
                    IsError = true;
                }

                if (IsError == true) {
                    return new OperationResult<EmailValidateVM> (false, "", Model);
                } else {
                    return new OperationResult<EmailValidateVM> (true, "", Model);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<EmailValidateVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}
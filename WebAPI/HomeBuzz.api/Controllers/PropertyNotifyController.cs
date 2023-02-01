using System;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/PropertyNotify")]
    public class PropertyNotifyController : Controller {

        private readonly IUserService _userService;
        private readonly IPropertyNotifyService _notifyService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ICompanyService _companyService;
        private readonly IAgentPaymentService _agentPaymentService;
        private readonly IUserRolesService _userRoleService;
        private ErrorLogService errorlogservice;
        private SignupUser signupUser;
        public PropertyNotifyController (IUserService userService,
            HomeBuzzContext context,
            IPropertyNotifyService notifyService,
            IHostingEnvironment hostingEnvironment,
            IEmailTemplateService emailTemplateService,
            IVerificationCodeService verificationCodeService,
            IPropertyViewService propertyViewService,
            ICompanyService companyService,
            IAgentPaymentService agentPaymentService,
            IUserRolesService userRoleService) {
            _userService = userService;
            _hostingEnvironment = hostingEnvironment;
            _notifyService = notifyService;
            signupUser = new SignupUser (userService, emailTemplateService, verificationCodeService, propertyViewService, companyService, agentPaymentService, userRoleService, context);
            errorlogservice = new ErrorLogService (context);
        }

        [AllowAnonymous]
        [HttpPost ("NotifyProperty")]
        public async Task<OperationResult<PropertyNotifyVM>> AddUpdate ([FromBody] PropertyNotifyVM Model) {
            try {
                // propertyNotify.UserId = Model.UserId.Value;
                User user = _userService.GetUserByEmail (Model.Email);
                if (user == null) {
                    UserVM userVM = new UserVM ();
                    userVM.Email = Model.Email;
                    userVM.Password = "Test@123";
                    var result = await signupUser.ProcessUserSignup (userVM);
                    Model.UserId = result.Id;
                } else {
                    Model.UserId = user.UserId;
                }
                var NotifyProperty = _notifyService.CheckInsertOrUpdate (Model);

                return new OperationResult<PropertyNotifyVM> (true, "", Model);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertyNotifyVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
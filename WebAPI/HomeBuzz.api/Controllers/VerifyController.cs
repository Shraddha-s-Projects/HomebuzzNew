using System;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Service;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using WebSocketManager;

namespace HomeBuzz.api.Controllers {
    [AllowAnonymous]
    [Route ("api/[controller]")]
    public class VerifyController : Controller {
        #region Class Object Initialization
        private ErrorLogService errorLogservice;
        private VerifyUser verifyUser;
        private Notification notification;
        private readonly ICompanyService _companyService;
        private readonly IUserRolesService _userRoleService;
        #endregion

        #region Constructor
        public VerifyController (IUserService userService,
            IHostingEnvironment hostingEnvironment,
            HomeBuzzContext context,
            IEmailTemplateService emailTemplateService,
            IVerificationCodeService verificationCodeService,
            NotificationsMessageHandler notificationsMessageHandler,
            INotificationService notificationService,
            IUserRolesService userRolesService,
            ICompanyService companyService) {
            verifyUser = new VerifyUser (userService, emailTemplateService, verificationCodeService, companyService, userRolesService, context);
            notification = new Notification (notificationsMessageHandler, notificationService);
            errorLogservice = new ErrorLogService (context);
            CommonMessage.AppURL = HomeBuzzContext.AppURL;
        }
        #endregion

        #region API Method Implementation
        /// <summary>
        /// This API used to verify user by verification code sent in sign up email
        /// </summary>
        /// <param name="emailHash">Hash of Email</param>
        /// <returns></returns>
        [HttpPost ("NewAccount")]
        public async Task<OperationResult<VerifyUserVM>> NewAccountAsync ([FromBody] VerifyUserVM model) {
            try {
                var result = await verifyUser.VerifyUserByVerificationCode (model);
                return new OperationResult<VerifyUserVM> (result.IsVerified, result.Message, result);
            } catch (Exception ex) {
                errorLogservice.LogException (ex);
                return new OperationResult<VerifyUserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        /// <summary>
        /// Check is email is verified or not
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost ("IsEmailAlreadyVerified")]
        public async Task<OperationResult<VerifyUserVM>> IsEmailAlreadyVerified ([FromBody] VerifyUserVM model) {
            try {
                var result = await verifyUser.IsEmailAlreadyVerified (model);
                return new OperationResult<VerifyUserVM> (result.IsVerified, result.Message, result);
            } catch (Exception ex) {
                errorLogservice.LogException (ex);
                return new OperationResult<VerifyUserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }
        #endregion
    }
}
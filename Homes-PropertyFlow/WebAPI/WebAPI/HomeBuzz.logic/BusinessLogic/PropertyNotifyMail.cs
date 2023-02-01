using System;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.logic.Common;

namespace HomeBuzz.logic {
    public class PropertyNotifyMail {
        #region Property Initialization
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private SendEmail sendEmail;

        private ErrorLogService errorlogservice;
        #endregion

        #region Constructor
        public PropertyNotifyMail (IUserService userService, IEmailTemplateService emailTemplateService, HomeBuzzContext context) {
            _userService = userService;
            _emailTemplateService = emailTemplateService;
            errorlogservice = new ErrorLogService (context);
            sendEmail = new SendEmail (emailTemplateService);
        }
        #endregion

            public async Task<PropertyNotifyVM> SentNotifyEmail (PropertyNotifyVM model) {
            var user = _userService.GetUserByUserId (model.UserId.Value);
            if (user != null) {

                // Send make offer email
                try {
                    await sendEmail.SentNotifyEmail (user.Email, user.FirstName, user.Email, model);
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

    }
}
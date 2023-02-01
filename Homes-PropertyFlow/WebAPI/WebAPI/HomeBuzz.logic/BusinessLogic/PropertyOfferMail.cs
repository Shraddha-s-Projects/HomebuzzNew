using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.helper;
using HomeBuzz.logic.Common;

namespace HomeBuzz.logic {
    public class PropertyOfferMail {
        #region Property Initialization
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private SendEmail sendEmail;

        private ErrorLogService errorlogservice;
        #endregion

        #region Constructor
        public PropertyOfferMail (IUserService userService, IEmailTemplateService emailTemplateService, HomeBuzzContext context) {
            _userService = userService;
            _emailTemplateService = emailTemplateService;
            errorlogservice = new ErrorLogService (context);
            sendEmail = new SendEmail (emailTemplateService);
        }
        #endregion

        #region 'Set Function'

        public async Task<PropertyOfferVM> MakeOfferMail (PropertyOfferVM model) {
            var user = _userService.GetUserByUserId (model.UserId.Value);
            if (user != null) {

                // Send make offer email
                try {
                    await sendEmail.SendMakeOfferEmail (user.Email, model.Address, model.OfferingAmount.ToString ());
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

        public async Task<PropertyOfferVM> RemoveOfferMail (PropertyOfferVM model) {
            var user = _userService.GetUserByUserId (model.UserId.Value);
            if (user != null) {

                // Send remove offer email
                try {
                    await sendEmail.SendRemoveOfferEmail (user.Email, model.Address, model.OfferingAmount.ToString ());
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

        public async Task<PropertyClaimVM> SendMutipleOfferMailToSeller (PropertyClaimVM model) {
            var user = _userService.GetUserByUserId (model.OwnerId.Value);
            if (user != null) {

                // Send remove offer email
                try {
                    await sendEmail.SendMutipleOfferEmailToSeller (user.Email, model.Address);
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

        public async Task<PropertyClaimVM> SendSingleOfferMailToSeller (PropertyClaimVM model) {
            var user = _userService.GetUserByUserId (model.OwnerId.Value);
            if (user != null) {

                // Send remove offer email
                try {
                    await sendEmail.SendSingleOfferEmailToSeller (user.Email, model.Address);
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

            public async Task<PropertyOfferVM> NegotiateOfferMail (PropertyOfferVM model) {
            var user = _userService.GetUserByUserId (model.UserId.Value);
            if (user != null) {

                // Send make offer email
                try {
                    await sendEmail.SendNegotiateOfferEmail (user.Email, model.Address, model.OfferingAmount.ToString (), model.Name, model.EmailOrPhone);
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

           public async Task<PropertyOfferVM> ExpireOfferMail (PropertyOfferVM model) {
            var user = _userService.GetUserByUserId (model.UserId.Value);
            if (user != null) {

                // Send expire offer email
                try {
                    await sendEmail.SendExpireOfferEmail (user.Email, model.Address, model.OfferingAmount.ToString ());
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

        #endregion
    }
}
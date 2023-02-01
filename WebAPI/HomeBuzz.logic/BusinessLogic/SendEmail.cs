using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.ViewModels;
using HomeBuzz.helper;

namespace HomeBuzz.logic {
    public class SendEmail {
        #region Object Initialization
        private readonly IEmailTemplateService _emailTemplateService;
        #endregion

        #region Constructor
        public SendEmail (IEmailTemplateService emailTemplateService) {
            _emailTemplateService = emailTemplateService;
        }
        #endregion

        #region User Signup and Acount Email
        /// <summary>
        /// This function is used to send sign up email
        /// </summary>
        /// <param name="email">Email</param>
        /// <param name="sysGenPassword">System Generated Password</param>
        public async Task SendSignUpEmail (string email, string emailHash, string receiverName, string verificationCode) {
            // Send Signup email
            var subject = DataUtility.CompanyName + " - Thanks for signing up with us!";
            var body = _emailTemplateService.GetEmailTemplateByCode ("SIGUP").TemplateHtml;
            body = body.Replace ("[CompanyName]", DataUtility.CompanyName).Replace ("[ToName]", receiverName).Replace ("[VerifyUrl]", HomeBuzzContext.AppURL + "verify-email/account/" + emailHash).Replace ("[UserName]", email).Replace ("[VerificationCode]", verificationCode);

            try {
                // await EmailManager.SendMailAsync (email, subject, body);
            } catch (Exception ex) {
                throw;
            }
        }

          public async Task SendAgentCompanyEmail (UserVM user) {
            // Send Signup email
            var subject = DataUtility.CompanyName + " - Thanks for signing up with us!";
            var agentEmail = "";
            for (int i = 0; i < user.AgentEmails.Count; i++)
            {
                if(i == 0){
                    agentEmail = user.AgentEmails[i].Email;
                } else {
                    agentEmail = agentEmail + " , " + user.AgentEmails[i].Email;
                }
            }
   
            var body = _emailTemplateService.GetEmailTemplateByCode ("AGSIG").TemplateHtml;
            body = body.Replace ("[CompanyName]", DataUtility.CompanyName).Replace ("[ToName]", user.CompanyName).Replace ("[AgentEmails]",agentEmail);

            try {
                await EmailManager.SendMailAsync (user.Email, subject, body);
            } catch (Exception ex) {
                throw;
            }
        }

        /// <summary>
        /// This function used to send password reset email
        /// </summary>
        /// <param name="email"></param>
        /// <param name="receiverName"></param>
        /// <param name="verificationCode"></param>
        /// <returns></returns>
        public async Task SendPasswordResetEmail (string email, string receiverName, string verificationCode) {
            // Send Signup email
            var subject = DataUtility.CompanyName + " - Account Password Reset";
            var body = _emailTemplateService.GetEmailTemplateByCode ("PSWRT").TemplateHtml;
            body = body.Replace ("[CompanyName]", DataUtility.CompanyName).Replace ("[ToName]", receiverName).Replace ("[VerifyUrl]", HomeBuzzContext.AppURL + "verify/account/" + ShaHash.GetHash (verificationCode) + "/" + ShaHash.GetHash (email)).Replace ("[VerificationCode]", verificationCode);
            try {
                await EmailManager.SendMailAsync (email, subject, body);
            } catch (Exception ex) {
                throw;
            }
        }

        /// <summary>
        /// This function is used to send sign up email
        /// </summary>
        /// <param name="email">Email</param>
        /// <param name="code">System Generated verification code</param>
        public async Task<bool> SendVerificationCode (string email, string receiverName, string code) {
            try {
                var subject = DataUtility.CompanyName + " - Verification code for Email change";
                var body = _emailTemplateService.GetEmailTemplateByCode ("ECVRC").TemplateHtml;
                body = body.Replace ("[CompanyName]", DataUtility.CompanyName).Replace ("[ToName]", receiverName).Replace ("[NewEmail]", email).Replace ("[VerificationCode]", code);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        /// <summary>
        /// This function is used to send email verified notification
        /// </summary>
        /// <param name="email">Email</param>
        /// <param name="sysGenPassword">System Generated Password</param>
        public async Task SendEmailVerifiedNotification (string email, string receiverName) {
            var subject = DataUtility.CompanyName + " - Email Verified For Your Account";
            var body = _emailTemplateService.GetEmailTemplateByCode ("EVERN").TemplateHtml;
            body = body.Replace ("[CompanyName]", DataUtility.CompanyName).Replace ("[ToName]", receiverName).Replace ("[Email]", email);

            try {
                await EmailManager.SendMailAsync (email, subject, body);
            } catch (Exception ex) {
                throw;
            }

        }
        #endregion

         public async Task SendEmailToCompanyAgentVerifiedAccount (string companyEmail, string companyName, string agentEmail) {
            var subject = DataUtility.CompanyName + " - Email Verified For Your Account";
            var body = _emailTemplateService.GetEmailTemplateByCode ("VECMP").TemplateHtml;
            body = body.Replace ("[CompanyName]", DataUtility.CompanyName).Replace ("[ToName]", companyName).Replace ("[Email]", companyEmail).Replace("[AgentEmail]", agentEmail);

            try {
                await EmailManager.SendMailAsync (companyEmail, subject, body);
            } catch (Exception ex) {
                throw;
            }

        }

        public async Task<bool> SendClaimEmail (string email, string address) {
            try {
                var subject = DataUtility.CompanyName + " - Claim Property";
                var body = _emailTemplateService.GetEmailTemplateByCode ("CLAIM").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendRemoveClaimEmail (string email, string address) {
            try {
                var subject = DataUtility.CompanyName + " - Unclaim Property";
                var body = _emailTemplateService.GetEmailTemplateByCode ("UNCLM").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendRenewClaimEmail (string email, string address) {
            try {
                var subject = DataUtility.CompanyName + " - Renew Property Claim";
                var body = _emailTemplateService.GetEmailTemplateByCode ("RENEW").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> TransferPropertyClaimEmail (string email, string address) {
            try {
                var subject = DataUtility.CompanyName + " - Transferownership Property";
                var body = _emailTemplateService.GetEmailTemplateByCode ("TRANS").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendMakeOfferEmail (string email, string address, string offerprice) {
            try {
                var subject = DataUtility.CompanyName + " - Make Offer";
                var body = _emailTemplateService.GetEmailTemplateByCode ("MKOFF").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address).Replace ("[OfferingAmount]", offerprice);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendRemoveOfferEmail (string email, string address, string offerprice) {
            try {
                var subject = DataUtility.CompanyName + " - Remove Offer";
                var body = _emailTemplateService.GetEmailTemplateByCode ("REOFF").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address).Replace ("[OfferingAmount]", offerprice);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendMutipleOfferEmailToSeller (string email, string address) {
            try {
                var subject = DataUtility.CompanyName + " - Offer Notification";
                var body = _emailTemplateService.GetEmailTemplateByCode ("MNOFF").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendSingleOfferEmailToSeller (string email, string address) {
            try {
                var subject = DataUtility.CompanyName + " - Make Offer Notification";
                var body = _emailTemplateService.GetEmailTemplateByCode ("SNOFF").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendNegotiateOfferEmail (string email, string address, string offerprice, string Name, string EmailOrPhone) {
            try {
                var subject = DataUtility.CompanyName + " - Negotiate Offer";
                var body = _emailTemplateService.GetEmailTemplateByCode ("NEOFF").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address).Replace ("[OfferingAmount]", offerprice).Replace ("[UserName]", Name).Replace ("[Email]", EmailOrPhone);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SendExpireOfferEmail (string email, string address, string offerprice) {
            try {
                var subject = DataUtility.CompanyName + " - Expire Offer";
                var body = _emailTemplateService.GetEmailTemplateByCode ("EXOFF").TemplateHtml;
                body = body.Replace ("[AddressUrl]", HomeBuzzContext.AppURL + "property?Address=" + address).Replace ("[Address]", address).Replace ("[OfferingAmount]", offerprice);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }

        public async Task<bool> SentNotifyEmail (string email, string Name, string EmailOrPhone, PropertyNotifyVM model) {
            try {
                var subject = DataUtility.CompanyName + " - Notify Property";
                var body = _emailTemplateService.GetEmailTemplateByCode ("NOPRO").TemplateHtml;
                body = body.Replace ("[UserName]", Name).Replace ("[Email]", EmailOrPhone).Replace ("[Address]",
                    model.Address).Replace ("[OpenedDate]", model.OpenedDate.ToLongDateString ()).Replace ("[Day]",
                    model.Day).Replace ("[Time]", model.Time);

                await EmailManager.SendMailAsync (email, subject, body);

                return true;
            } catch (Exception ex) {
                //  return false;
                throw;
            }
        }
    }
}
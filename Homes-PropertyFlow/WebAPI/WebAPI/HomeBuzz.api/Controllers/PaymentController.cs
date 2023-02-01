using HomeBuzz.data;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayPal.Api;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/Payment")]
    public class PaymentController : Controller {
        private readonly IPaypalServices _paypalServices;
        private readonly IUserService _userService;
        private ErrorLogService errorlogservice;

        public PaymentController (
            IPaypalServices paypalServices,
            IUserService userService,
            HomeBuzzContext context
        ) {
            _paypalServices = paypalServices;
            _userService = userService;
            errorlogservice = new ErrorLogService (context);
        }

        [AllowAnonymous]
        [HttpPost ("CreatePayment")]
        public string CreatePayment ([FromBody] PaymentVM paymentVM) {
            string redirectLink = "";
            try {
                if (paymentVM != null) {
                    paymentVM.PayPalClientId = HomeBuzzContext.PayPalClientId;
                    paymentVM.PayPalClientSecret = HomeBuzzContext.PayPalClientSecret;
                    // var payment = _paypalServices.CreatePayment (100, "http://localhost:4200/dashboard", "http://localhost:4200/dashboard", "sale");
                    var userObj = _userService.GetUserByUserId (paymentVM.UserId.Value);
                    if (userObj != null) {
                        paymentVM.Email = userObj.Email;
                        paymentVM.FirstName = userObj.FirstName;
                        paymentVM.LastName = userObj.LastName;
                    }
                    var payment = _paypalServices.CreatePayment (paymentVM);
                    for (int i = 0; i < payment.links.Count; i++) {
                        if (payment.links[i].method == "REDIRECT") {
                            redirectLink = payment.links[i].href;
                        }
                    }
                }
                return redirectLink;
            } catch (System.Exception ex) {

                throw ex;
            }

        }

        [HttpPost ("CreateBillingPlan")]
        public string CreateBillingPlan ([FromBody] BillingPlanVM billingPlanVM) {
            string redirectLink = "";
            // PlanVM planVM = new PlanVM ();
            try {
                if (billingPlanVM == null) {
                    billingPlanVM = new BillingPlanVM ();
                }

                billingPlanVM.PayPalClientId = HomeBuzzContext.PayPalClientId;
                billingPlanVM.PayPalClientSecret = HomeBuzzContext.PayPalClientSecret;

                // Create Billing Plan
                var billingPlan = _paypalServices.CreateBillingPlan (billingPlanVM);

                // Create Agreement
                var agreement = _paypalServices.createAgreement (billingPlan.id, billingPlanVM);

                for (int i = 0; i < agreement.links.Count; i++) {
                    if (agreement.links[i].method == "REDIRECT") {
                        redirectLink = agreement.links[i].href;
                    }
                }

                // planVM.id = billingPlan.id;
                // planVM.name = billingPlan.name;
                // planVM.description = billingPlan.description;
                // planVM.type = billingPlan.type;
                // planVM.state = billingPlan.state;
                // planVM.payment_definitions  = billingPlan.payment_definitions;
                // planVM.merchant_preferences = billingPlan.merchant_preferences;
                // planVM.create_time = billingPlan.create_time;
                // planVM.update_time = billingPlan.update_time;
                // planVM.links = billingPlan.links;

                return redirectLink;
            } catch (System.Exception ex) {
                errorlogservice.LogException (ex);
                throw ex;
            }

        }

        [HttpGet ("ExecuteAgreement")]
        public AgreementVM ExecuteAgreement (string token) {
            try {
                PaymentVM paymentVM = new PaymentVM ();
                paymentVM.PayPalClientId = HomeBuzzContext.PayPalClientId;
                paymentVM.PayPalClientSecret = HomeBuzzContext.PayPalClientSecret;
                AgreementVM agreementVM = new AgreementVM ();
                var Agreement = _paypalServices.ExecuteAgreement (token, paymentVM);
                if (Agreement != null) {
                    agreementVM.id = Agreement.id;
                    agreementVM.state = Agreement.state;
                    agreementVM.name = Agreement.name;
                    agreementVM.description = Agreement.description;
                    agreementVM.start_date = Agreement.start_date;
                    agreementVM.agreement_details = Agreement.agreement_details;
                    agreementVM.payer = Agreement.payer;
                    agreementVM.shipping_address = Agreement.shipping_address;
                    agreementVM.override_merchant_preferences = Agreement.override_merchant_preferences;
                    agreementVM.override_charge_models = Agreement.override_charge_models;
                    agreementVM.plan = Agreement.plan;
                    agreementVM.create_time = Agreement.create_time;
                    agreementVM.update_time = Agreement.update_time;
                    agreementVM.token = Agreement.token;
                }
                return agreementVM;

            } catch (System.Exception ex) {
                errorlogservice.LogException (ex);
                throw ex;
            }
        }
    }
}
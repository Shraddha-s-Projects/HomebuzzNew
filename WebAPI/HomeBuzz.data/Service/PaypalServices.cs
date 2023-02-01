using System;
using System.Collections.Generic;
using HomeBuzz.data.ConfigOptions;
using HomeBuzz.data.Models.ViewModels;
using PayPal.Api;
using Payment = PayPal.Api.Payment;

namespace HomeBuzz.data.Service {
    public partial class PaypalServices : IPaypalServices {
        private PayPalAuthOptions _options;
        public HomeBuzzContext context;
        public Payment CreatePayment (PaymentVM paymentVM) {
            // _options = new PayPalAuthOptions ();
            // _options.PayPalClientId = "AcaVVHszlTcWFOefE6h_M0qDeQ5EGSCg4QmO5VLbix5J5u8ee0lVvybHY9iF9y61tKaRGHFPJUGWUK9Q";
            // _options.PayPalClientSecret = "EGKFY83wuUFugNquXTrHpGR0PO8qWWINJT_Cg663qzhewrGhTMXFQTzfU3Lm_aXs3SqMUadM7nNXefnO";

            var apiContext = new APIContext (new OAuthTokenCredential (paymentVM.PayPalClientId, paymentVM.PayPalClientSecret).GetAccessToken ());

            var payment = new Payment () {
                intent = paymentVM.Intent,
                payer = new Payer () { payment_method = "paypal" },
                transactions = GetTransactionsList (paymentVM),
                redirect_urls = new RedirectUrls () {
                cancel_url = paymentVM.CancelUrl,
                return_url = paymentVM.ReturnUrl
                }
            };

            var createdPayment = payment.Create (apiContext);

            return createdPayment;
        }

        private List<Transaction> GetTransactionsList (PaymentVM paymentVM) {
            var transactionList = new List<Transaction> ();

            transactionList.Add (new Transaction () {
                description = paymentVM.Description,
                    invoice_number = GetRandomInvoiceNumber (),
                    amount = new Amount () {
                        currency = paymentVM.Currency,
                            total = paymentVM.Amount.ToString (),
                            details = new Details () {
                                tax = "0",
                                    shipping = "0",
                                    subtotal = paymentVM.Amount.ToString ()
                            }
                    },
                    item_list = new ItemList () {
                        items = new List<Item> () {
                            new Item () {
                                name = "Payment",
                                    currency = paymentVM.Currency,
                                    price = paymentVM.Amount.ToString (),
                                    quantity = "1",
                                    sku = "sku"
                            }
                        }
                    },
                    payee = new Payee {
                        // TODO.. Enter the payee email address here
                        email = paymentVM.Email,

                            // TODO.. Enter the merchant id here
                            merchant_id = ""
                    }
            });

            return transactionList;
        }

        public Payment ExecutePayment (string paymentId, string payerId) {
            var apiContext = new APIContext (new OAuthTokenCredential (_options.PayPalClientId, _options.PayPalClientSecret).GetAccessToken ());

            var paymentExecution = new PaymentExecution () { payer_id = payerId };

            var executedPayment = new Payment () { id = paymentId }.Execute (apiContext, paymentExecution);

            return executedPayment;
        }

        public Plan CreateBillingPlan (BillingPlanVM billingPlanVM) {
            try {
                var apiContext = new APIContext (new OAuthTokenCredential (billingPlanVM.PayPalClientId, billingPlanVM.PayPalClientSecret).GetAccessToken ());

                // Create Billing plan
                PaymentDefinition paymentDefinition1 = new PaymentDefinition ();
                paymentDefinition1.name = "Test Defination";
                paymentDefinition1.type = "TRIAL";
                // paymentDefinition1.frequency = "DAY";
                paymentDefinition1.frequency = "MONTH";
                paymentDefinition1.frequency_interval = "1";
                paymentDefinition1.amount = new Currency () {
                    currency = billingPlanVM.Currency,
                    value = billingPlanVM.Amount.ToString ()
                };
                paymentDefinition1.cycles = "1";
                PaymentDefinition paymentDefinition2 = new PaymentDefinition ();
                paymentDefinition2.name = "Test Defination";
                paymentDefinition2.type = "REGULAR";
                // paymentDefinition2.frequency = "DAY";
                paymentDefinition2.frequency = "MONTH";
                paymentDefinition2.frequency_interval = "1";
                paymentDefinition2.amount = new Currency () {
                    currency = "NZD",
                    value = billingPlanVM.Amount.ToString ()
                };
                // paymentDefinition2.cycles = "30";
                paymentDefinition2.cycles = "11";
                var payment_definitions = new List<PaymentDefinition> ();
                payment_definitions.Add (paymentDefinition1);
                payment_definitions.Add (paymentDefinition2);

                var plan = new Plan () {
                    name = billingPlanVM.Name,
                    description = billingPlanVM.Description,
                    type = "FIXED",
                    payment_definitions = payment_definitions,
                    merchant_preferences = new MerchantPreferences () {
                    return_url = billingPlanVM.ReturnUrl,
                    cancel_url = billingPlanVM.CancelUrl,
                    auto_bill_amount = "YES",
                    initial_fail_amount_action = "CONTINUE",
                    max_fail_attempts = "0"
                    }
                };

                var createdPlan = plan.Create (apiContext);

                // Update Billing plan state created to active

                Patch xPatch = new Patch ();
                xPatch.op = "replace";
                xPatch.path = "/";
                xPatch.value = new Plan () { state = "ACTIVE" };

                PatchRequest yPatch = new PatchRequest ();
                yPatch.Add (xPatch);

                createdPlan.Update (apiContext, yPatch);
                createdPlan.state = "ACTIVE";
                return createdPlan;
            } catch (System.Exception ex) {

                throw ex;
            }
        }

        public Agreement createAgreement (string planId, BillingPlanVM billingPlanVM) {
            try {
                var apiContext = new APIContext (new OAuthTokenCredential (billingPlanVM.PayPalClientId, billingPlanVM.PayPalClientSecret).GetAccessToken ());
                var payer = new Payer () { payment_method = "paypal" };
                var shippingAddress = new ShippingAddress () {
                    line1 = "111 First Street",
                    city = "Saratoga",
                    state = "CA",
                    postal_code = "95070",
                    country_code = "NZ"
                };

                var agreement = new Agreement () {
                    name = "Test Agreement",
                    description = "Test Agreement Description",
                    start_date = billingPlanVM.start_date,
                    // start_date = "2020-05-16T00:37:04Z",
                    payer = payer,
                    plan = new Plan () { id = planId },
                    shipping_address = shippingAddress
                };

                var createdAgreement = agreement.Create (apiContext);

                return createdAgreement;
            } catch (System.Exception ex) {

                throw ex;
            }
        }

        public Agreement ExecuteAgreement (string token, PaymentVM paymentVM) {
            var apiContext = new APIContext (new OAuthTokenCredential (paymentVM.PayPalClientId, paymentVM.PayPalClientSecret).GetAccessToken ());
            var agreement1 = new Agreement () { token = token };
            var executedAgreement = agreement1.Execute (apiContext);
            return executedAgreement;
        }

        private string GetRandomInvoiceNumber () {
            return new Random ().Next (999999999).ToString ();
        }
    }

    public partial interface IPaypalServices {
        Payment CreatePayment (PaymentVM paymentVM);

        Payment ExecutePayment (string paymentId, string payerId);

        Plan CreateBillingPlan (BillingPlanVM billingPlanVM);

        Agreement createAgreement (string planId, BillingPlanVM billingPlanVM);

        Agreement ExecuteAgreement (string token, PaymentVM paymentVM);
    }
}
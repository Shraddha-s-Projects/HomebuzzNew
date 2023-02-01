//==============================================================================
//
//  This file was auto-generated by a tool using the PayPal REST API schema.
//  More information: https://developer.paypal.com/docs/api/
//
//==============================================================================
using System.Collections.Generic;
using Newtonsoft.Json;
using PayPal.Util;

namespace PayPal.Api
{
    /// <summary>
    /// A REST API billing plan resource.
    /// <para>
    /// See <a href="https://developer.paypal.com/docs/api/">PayPal Developer documentation</a> for more information.
    /// </para>
    /// </summary>
    public class Plan : PayPalRelationalObject
    {
        /// <summary>
        /// Identifier of the billing plan. 128 characters max.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "id")]
        public string id { get; set; }

        /// <summary>
        /// Name of the billing plan. 128 characters max.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "name")]
        public string name { get; set; }

        /// <summary>
        /// Description of the billing plan. 128 characters max.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "description")]
        public string description { get; set; }

        /// <summary>
        /// Type of the billing plan. Allowed values: `FIXED`, `INFINITE`.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "type")]
        public string type { get; set; }

        /// <summary>
        /// Status of the billing plan. Allowed values: `CREATED`, `ACTIVE`, `INACTIVE`, and `DELETED`.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "state")]
        public string state { get; set; }

        /// <summary>
        /// Time when the billing plan was created. Format YYYY-MM-DDTimeTimezone, as defined in [ISO8601](http://tools.ietf.org/html/rfc3339#section-5.6).
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "create_time")]
        public string create_time { get; set; }

        /// <summary>
        /// Time when this billing plan was updated. Format YYYY-MM-DDTimeTimezone, as defined in [ISO8601](http://tools.ietf.org/html/rfc3339#section-5.6).
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "update_time")]
        public string update_time { get; set; }

        /// <summary>
        /// Array of payment definitions for this billing plan.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "payment_definitions")]
        public List<PaymentDefinition> payment_definitions { get; set; }

        /// <summary>
        /// Array of terms for this billing plan.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "terms")]
        public List<Terms> terms { get; set; }

        /// <summary>
        /// Specific preferences such as: set up fee, max fail attempts, autobill amount, and others that are configured for this billing plan.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "merchant_preferences")]
        public MerchantPreferences merchant_preferences { get; set; }

        /// <summary>
        /// Retrieve the details for a particular billing plan by passing the billing plan ID to the request URI.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="planId">ID of the billing plan to return details about.</param>
        /// <returns>Plan</returns>
        public static Plan Get(APIContext apiContext, string planId)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(planId, "planId");

            // Configure and send the request
            var pattern = "v1/payments/billing-plans/{0}";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { planId });
            return PayPalResource.ConfigureAndExecute<Plan>(apiContext, HttpMethod.GET, resourcePath);
        }

        /// <summary>
        /// Create a new billing plan by passing the details for the plan, including the plan name, description, and type, to the request URI.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <returns>Plan</returns>
        public Plan Create(APIContext apiContext)
        {
            return Plan.Create(apiContext, this);
        }

        /// <summary>
        /// Create a new billing plan by passing the details for the plan, including the plan name, description, and type, to the request URI.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="plan">The Plan object to be used to create the billing plan resource.</param>
        /// <returns>Plan</returns>
        public static Plan Create(APIContext apiContext, Plan plan)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);

            // Configure and send the request
            var resourcePath = "v1/payments/billing-plans";
            return PayPalResource.ConfigureAndExecute<Plan>(apiContext, HttpMethod.POST, resourcePath, plan.ConvertToJson());
        }

        /// <summary>
        /// Replace specific fields within a billing plan by passing the ID of the billing plan to the request URI. In addition, pass a patch object in the request JSON that specifies the operation to perform, field to update, and new value for each update.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="patchRequest">PatchRequest</param>
        public void Update(APIContext apiContext, PatchRequest patchRequest)
        {
            Plan.Update(apiContext, this.id, patchRequest);
        }

        /// <summary>
        /// Replace specific fields within a billing plan by passing the ID of the billing plan to the request URI. In addition, pass a patch object in the request JSON that specifies the operation to perform, field to update, and new value for each update.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="planId">ID of the billing plan to be updated.</param>
        /// <param name="patchRequest">PatchRequest</param>
        public static void Update(APIContext apiContext, string planId, PatchRequest patchRequest)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(planId, "planId");
            ArgumentValidator.Validate(patchRequest, "patchRequest");

            // Configure and send the request
            var pattern = "v1/payments/billing-plans/{0}";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { planId });
            PayPalResource.ConfigureAndExecute(apiContext, HttpMethod.PATCH, resourcePath, patchRequest.ConvertToJson());
        }

        /// <summary>
        /// List billing plans according to optional query string parameters specified.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="page">A non-zero integer representing the 'page' of the results.</param>
        /// <param name="status">Specifies the status (CREATED, ACTIVE, or INACTIVE) of the billing plans to return.</param>
        /// <param name="pageSize">A non-negative, non-zero integer indicating the maximum number of results to return at one time.</param>
        /// <param name="totalRequired">A boolean indicating total number of items (total_items) and pages (total_pages) are expected to be returned in the response</param>
        /// <returns>PlanList</returns>
        public static PlanList List(APIContext apiContext, string page = "0", string status = "CREATED", string pageSize = "10", string totalRequired = "yes")
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);

            var queryParameters = new QueryParameters();
            queryParameters["page"] = page;
            queryParameters["status"] = status;
            queryParameters["page_size"] = pageSize;
            queryParameters["total_required"] = totalRequired;

            // Configure and send the request
            var resourcePath = "v1/payments/billing-plans" + queryParameters.ToUrlFormattedString();
            return PayPalResource.ConfigureAndExecute<PlanList>(apiContext, HttpMethod.GET, resourcePath);
        }

        /// <summary>
        /// Deletes the specified billing plan.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        public void Delete(APIContext apiContext)
        {
            Plan.Delete(apiContext, this.id);
        }

        /// <summary>
        /// Deletes the specified billing plan.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="planId">ID of the billing plan to delete.</param>
        public static void Delete(APIContext apiContext, string planId)
        {
            var patchRequest = new PatchRequest
            {
                new Patch
                {
                    op = "replace",
                    path = "/",
                    value = new Plan { state = "DELETED" }
                }
            };
            Plan.Update(apiContext, planId, patchRequest);
        }
    }
}

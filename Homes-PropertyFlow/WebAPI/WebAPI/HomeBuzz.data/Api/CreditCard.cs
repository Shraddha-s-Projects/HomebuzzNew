//==============================================================================
//
//  This file was auto-generated by a tool using the PayPal REST API schema.
//  More information: https://developer.paypal.com/docs/api/
//
//==============================================================================
using Newtonsoft.Json;
using PayPal.Util;

namespace PayPal.Api
{
    /// <summary>
    /// A REST API credit card resource.
    /// <para>
    /// See <a href="https://developer.paypal.com/docs/api/">PayPal Developer documentation</a> for more information.
    /// </para>
    /// </summary>
    public class CreditCard : PayPalRelationalObject
    {
        /// <summary>
        /// ID of the credit card being saved for later use.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "id")]
        public string id { get; set; }

        /// <summary>
        /// Card number.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "number")]
        public string number { get; set; }

        /// <summary>
        /// Type of the Card (eg. Visa, Mastercard, etc.).
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "type")]
        public string type { get; set; }

        /// <summary>
        /// 2 digit card expiry month.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "expire_month")]
        public int expire_month { get; set; }

        /// <summary>
        /// 4 digit card expiry year
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "expire_year")]
        public int expire_year { get; set; }

        /// <summary>
        /// Card validation code. Only supported when making a Payment but not when saving a credit card for future use.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "cvv2")]
        public string cvv2 { get; set; }

        /// <summary>
        /// Card holder's first name.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "first_name")]
        public string first_name { get; set; }

        /// <summary>
        /// Card holder's last name.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "last_name")]
        public string last_name { get; set; }

        /// <summary>
        /// Billing Address associated with this card.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "billing_address")]
        public Address billing_address { get; set; }

        /// <summary>
        /// A unique identifier of the payer generated and provided by the facilitator. This is required when creating or using a tokenized funding instrument.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "payer_id")]
        public string payer_id { get; set; }

        /// <summary>
        /// A unique identifier of the customer to whom this bank account belongs to. Generated and provided by the facilitator. This is required when creating or using a stored funding instrument in vault.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "external_customer_id")]
        public string external_customer_id { get; set; }

        /// <summary>
        /// A user provided, optional convenvience field that functions as a unique identifier for the merchant on behalf of whom this credit card is being stored for. Note that this has no relation to PayPal merchant id
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "merchant_id")]
        public string merchant_id { get; set; }

        /// <summary>
        /// A unique identifier of the bank account resource. Generated and provided by the facilitator so it can be used to restrict the usage of the bank account to the specific merchant.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "external_card_id")]
        public string external_card_id { get; set; }

        /// <summary>
        /// State of the funding instrument.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "state")]
        public string state { get; set; }

        /// <summary>
        /// Resource creation time  as ISO8601 date-time format (ex: 1994-11-05T13:15:30Z) that indicates creation time.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "create_time")]
        public string create_time { get; set; }

        /// <summary>
        /// Resource creation time  as ISO8601 date-time format (ex: 1994-11-05T13:15:30Z) that indicates the updation time.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "update_time")]
        public string update_time { get; set; }

        /// <summary>
        /// Date/Time until this resource can be used fund a payment.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "valid_until")]
        public string valid_until { get; set; }

        /// <summary>
        /// Creates a new Credit Card Resource (aka Tokenize).
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <returns>CreditCard</returns>
        public CreditCard Create(APIContext apiContext)
        {
            return CreditCard.Create(apiContext, this);
        }

        /// <summary>
        /// Creates a new Credit Card Resource (aka Tokenize).
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="creditCard">CreditCard object to be used to create the PayPal resource.</param>
        /// <returns>CreditCard</returns>
        public static CreditCard Create(APIContext apiContext, CreditCard creditCard)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);

            // Configure and send the request
            var resourcePath = "v1/vault/credit-cards";
            return PayPalResource.ConfigureAndExecute<CreditCard>(apiContext, HttpMethod.POST, resourcePath, creditCard.ConvertToJson());
        }

        /// <summary>
        /// Obtain the Credit Card resource for the given identifier.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="creditCardId">Identifier of the credit card resource to obtain the data for.</param>
        /// <returns>CreditCard</returns>
        public static CreditCard Get(APIContext apiContext, string creditCardId)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(creditCardId, "creditCardId");

            // Configure and send the request
            var pattern = "v1/vault/credit-cards/{0}";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { creditCardId });
            return PayPalResource.ConfigureAndExecute<CreditCard>(apiContext, HttpMethod.GET, resourcePath);
        }

        /// <summary>
        /// Delete the Credit Card resource for the given identifier.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        public void Delete(APIContext apiContext)
        {
            CreditCard.Delete(apiContext, this.id);
        }

        /// <summary>
        /// Delete the Credit Card resource for the given identifier.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="creditCardId">Identifier of the credit card resource to obtain the data for.</param>
        public static void Delete(APIContext apiContext, string creditCardId)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(creditCardId, "creditCardId");

            // Configure and send the request
            apiContext.MaskRequestId = true;
            var pattern = "v1/vault/credit-cards/{0}";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { creditCardId });
            PayPalResource.ConfigureAndExecute(apiContext, HttpMethod.DELETE, resourcePath);
        }

        /// <summary>
        /// Update information in a previously saved card. Only the modified fields need to be passed in the request.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="patchRequest">PatchRequest</param>
        /// <returns>CreditCard</returns>
        public CreditCard Update(APIContext apiContext, PatchRequest patchRequest)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(this.id, "Id");
            ArgumentValidator.Validate(patchRequest, "patchRequest");

            // Configure and send the request
            var pattern = "v1/vault/credit-cards/{0}";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { this.id });
            return PayPalResource.ConfigureAndExecute<CreditCard>(apiContext, HttpMethod.PATCH, resourcePath, patchRequest.ConvertToJson());
        }

        /// <summary>
        /// Update information in a previously saved card. Only the modified fields need to be passed in the request.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="creditCardId">ID fo the credit card to update.</param>
        /// <param name="patchRequest">PatchRequest</param>
        /// <returns>CreditCard</returns>
        public static CreditCard Update(APIContext apiContext, string creditCardId, PatchRequest patchRequest)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(creditCardId, "creditCardId");
            ArgumentValidator.Validate(patchRequest, "patchRequest");

            // Configure and send the request
            var pattern = "v1/vault/credit-cards/{0}";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { creditCardId });
            return PayPalResource.ConfigureAndExecute<CreditCard>(apiContext, HttpMethod.PATCH, resourcePath, patchRequest.ConvertToJson());
        }

        /// <summary>
        /// Retrieves a list of Credit Card resources.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="pageSize">Number of items to be returned in the current page size, by a GET operation.</param>
        /// <param name="page">The page number to be retrieved, for the list of items, by the current GET request.</param>
        /// <param name="startTime">Resource creation time  as ISO8601 date-time format (ex: 1994-11-05T13:15:30Z) that indicates the start of a range of results.</param>
        /// <param name="endTime">Resource creation time as ISO8601 date-time format (ex: 1994-11-05T13:15:30Z) that indicates the end of a range of results.</param>
        /// <param name="sortOrder">Sort based on order of results. Options include 'asc' for ascending order or 'desc' for descending order.</param>
        /// <param name="sortBy">Sort based on 'create_time' or 'update_time'.</param>
        /// <param name="merchantId">Merchant identifier to filter the search results in list operations.</param>
        /// <param name="externalCardId">Externally provided card identifier to filter the search results in list operations.</param>
        /// <param name="externalCustomerId">Externally provided customer identifier to filter the search results in list operations.</param>
        /// <param name="totalRequired">Identifies if total count is required or not. Defaults to true.</param>
        /// <returns>CreditCardList</returns>
        public static CreditCardList List(APIContext apiContext, int pageSize = 10, int page = 1, string startTime = "", string endTime = "", string sortOrder = "asc", string sortBy = "create_time", string merchantId = "", string externalCardId = "", string externalCustomerId = "", bool totalRequired = true)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);

            var queryParameters = new QueryParameters();
            queryParameters["page_size"] = pageSize.ToString();
            queryParameters["page"] = page.ToString();
            queryParameters["start_time"] = startTime;
            queryParameters["end_time"] = endTime;
            queryParameters["sort_order"] = sortOrder;
            queryParameters["sort_by"] = sortBy;
            queryParameters["merchant_id"] = merchantId;
            queryParameters["external_card_id"] = externalCardId;
            queryParameters["external_customer_id"] = externalCustomerId;
            queryParameters["total_required"] = totalRequired.ToString();

            // Configure and send the request
            var resourcePath = "v1/vault/credit-cards" + queryParameters.ToUrlFormattedString();
            return PayPalResource.ConfigureAndExecute<CreditCardList>(apiContext, HttpMethod.GET, resourcePath);
        }
    }
}

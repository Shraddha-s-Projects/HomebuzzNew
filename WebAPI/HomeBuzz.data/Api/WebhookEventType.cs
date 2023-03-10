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
    /// Details about a specific webhook event type that a <seealso cref="Webhook"/> can be setup to listen to.
    /// <para>
    /// See <a href="https://developer.paypal.com/docs/api/">PayPal Developer documentation</a> for more information.
    /// </para>
    /// </summary>
    public class WebhookEventType : PayPalResource
    {
        /// <summary>
        /// Unique event-type name.
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "name")]
        public string name { get; set; }

        /// <summary>
        /// Human readable description of the event-type
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, PropertyName = "description")]
        public string description { get; set; }

        /// <summary>
        /// Retrieves the list of events-types subscribed by the given Webhook.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <param name="webhookId">Identifier of the webhook</param>
        /// <returns>EventTypeList</returns>
        public static WebhookEventTypeList SubscribedEventTypes(APIContext apiContext, string webhookId)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);
            ArgumentValidator.Validate(webhookId, "webhookId");

            // Configure and send the request
            var pattern = "v1/notifications/webhooks/{0}/event-types";
            var resourcePath = SDKUtil.FormatURIPath(pattern, new object[] { webhookId });
            return PayPalResource.ConfigureAndExecute<WebhookEventTypeList>(apiContext, HttpMethod.GET, resourcePath);
        }

        /// <summary>
        /// Retrieves the master list of available Webhooks events-types resources for any webhook to subscribe to.
        /// </summary>
        /// <param name="apiContext">APIContext used for the API call.</param>
        /// <returns>EventTypeList</returns>
        public static WebhookEventTypeList AvailableEventTypes(APIContext apiContext)
        {
            // Validate the arguments to be used in the request
            // ArgumentValidator.ValidateAndSetupAPIContext(apiContext);

            // Configure and send the request
            var resourcePath = "v1/notifications/webhooks-event-types";
            return PayPalResource.ConfigureAndExecute<WebhookEventTypeList>(apiContext, HttpMethod.GET, resourcePath);
        }
    }
}

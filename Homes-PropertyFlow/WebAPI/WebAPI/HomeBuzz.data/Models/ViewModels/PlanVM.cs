using System.Collections.Generic;
using PayPal.Api;

namespace HomeBuzz.data.Models.ViewModels
{
    public class PlanVM
    {
        public string id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string type { get; set; }
        public string state { get; set; }
        public string create_time { get; set; }
        public string update_time { get; set; }
        public List<PaymentDefinition> payment_definitions { get; set; }
        public List<Terms> terms { get; set; }
        public MerchantPreferences merchant_preferences { get; set; }
        public List<Links> links { get; set; }
    }
}
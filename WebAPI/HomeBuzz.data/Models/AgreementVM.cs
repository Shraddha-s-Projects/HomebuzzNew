using System.Collections.Generic;
using PayPal.Api;

namespace HomeBuzz.data.Models.ViewModels {
    public class AgreementVM {
        public string id { get; set; }
        public string state { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string start_date { get; set; }
        public AgreementDetails agreement_details { get; set; }
        public Payer payer { get; set; }
        public Address shipping_address { get; set; }
        public MerchantPreferences override_merchant_preferences { get; set; }
        public List<OverrideChargeModel> override_charge_models { get; set; }
        public Plan plan { get; set; }
        public string create_time { get; set; }
        public string update_time { get; set; }
        public string token { get; set; }

    }
}
using System;
namespace HomeBuzz.data.Models.Tables {
    public class AgentPayment {
        public int Id { get; set; }
        public int? Company { get; set; }
        public long? User { get; set; }
        public string BillingPlan { get; set; }
        public string BillingAgreement { get; set; }
        public string Token { get; set; }
        public string State { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
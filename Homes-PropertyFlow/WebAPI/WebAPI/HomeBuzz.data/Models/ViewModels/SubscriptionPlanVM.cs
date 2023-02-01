using System;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Models.ViewModels {
    public class SubscriptionPlanVM {
        public int Id { get; set; }
        public string Name { get; set; }
        public SubscriptionPlanDetail SubscriptionPlanDetail { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
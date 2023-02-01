using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
namespace HomeBuzz.data.Models.Tables {
    public class SubscriptionPlanDetail {
        [Key, Required]
        public int Id { get; set; }
        public int? SubscriptionPlan { get; set; }
        public string Agents { get; set; }
        public int? TrialPeriod { get; set; }
        public decimal? Price { get; set; }
        public bool IsListingReferrals { get; set; } = false;
        public bool IsSalesLeadsAndTracking { get; set; } = false;
        public bool IsMetricsAndAnalytics { get; set; } = false;
        public bool IsReporting { get; set; } = false;
        public bool IsFindAgentListing { get; set; } = false;
        public bool IsRealtimeMarketUpdates { get; set; } = false;
        public string NetWorkDashboard { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
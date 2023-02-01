using System;

namespace HomeBuzz.data.Models.ViewModels
{
    public class PropertyFlowInterestVM
    {
        public int Id { get; set; }
        public int? PropertyId { get; set; }
        public int? PropertyDetailId { get; set; }
        public int? Ranking { get; set; }
        public string RankingStatus { get; set; }
        public int? ViewCount { get; set; }
        public string Time { get; set; }
        public int? ComparativeInterest { get; set; }
        public int? ViewBlock { get; set; }
        public int? PerformanceRange { get; set; }
        public int? HigherPerformanceRange { get; set; }
        public int? LowerPerformanceRange { get; set; }
        public string Performance { get; set; }
        public string ViewerStrength { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
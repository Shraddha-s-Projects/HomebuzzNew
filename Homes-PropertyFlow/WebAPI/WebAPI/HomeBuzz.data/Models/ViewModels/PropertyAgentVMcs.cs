using System;
namespace HomeBuzz.data.Models.ViewModels {
    public class PropertyAgentVM {
        public int Id { get; set; }
        public int? PropertyDetailId { get; set; }
        public long? OwnerId { get; set; }
        public int? AgentOptionId { get; set; }
        public bool IsListProperty { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? PageNum { get; set; }
        public string AgentOptionName { get; set; }
    }
}
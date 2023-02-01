using System;
using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models
{
    public class PropertyAgent
    {
        [Key, Required]
        public int Id { get; set; }
        public int? PropertyDetailId { get; set; }
        public int? AgentOptionId { get; set; }
        public long? OwnerId { get; set; }
        public decimal? AppraisalPrice { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
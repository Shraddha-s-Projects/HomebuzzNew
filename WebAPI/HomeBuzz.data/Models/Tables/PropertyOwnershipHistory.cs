using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class PropertyOwnershipHistory
    {
        [Key, Required]
        public int Id { get; set; }
        public int? PropertyId { get; set; }
        public int? PropertyDetailId { get; set; }
        public long? FromOwnerId { get; set; }
        public long? ToOwnerId { get; set; }
        public int? Action { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
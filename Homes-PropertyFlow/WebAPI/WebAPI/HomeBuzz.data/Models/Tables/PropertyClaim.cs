using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class PropertyClaim
    {
        [Key, Required]
        public int Id { get; set; }

        public int? PropertyDetailId { get; set; }

        public DateTime ClaimedOn { get; set; }

        public bool IsReadTerms { get; set; }

        public long? OwnerId { get; set; }
    }
}

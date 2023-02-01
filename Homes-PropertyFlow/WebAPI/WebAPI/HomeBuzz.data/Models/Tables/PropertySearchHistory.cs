using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models {
    public class PropertySearchHistory {
        [Key, Required]
        public int Id { get; set; }

        public int? PropertyId { get; set; }

        public long? UserId { get; set; }

        public string Address { get; set; }

        public string Bedrooms { get; set; }

        public string Bathrooms { get; set; }

        public string PropertyStatus { get; set; }

        public bool IsExactMatchBed { get; set; } = false;

        public bool IsExactMatchBath { get; set; } = false;

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public string FromTo { get; set; }

        public DateTime CreatedOn { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

    }
}
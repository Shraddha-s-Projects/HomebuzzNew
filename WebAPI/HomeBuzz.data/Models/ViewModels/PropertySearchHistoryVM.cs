using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels {
    public class PropertySearchHistoryVM {
        public int Id { get; set; }

        public int? PropertyId { get; set; }

        public long? UserId { get; set; }

        public string Address { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }

        public string Bedrooms { get; set; }

        public string Bathrooms { get; set; }

        public int? PropertyStatusId { get; set; }

        public string PropertyStatus { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public DateTime CreatedOn { get; set; }

        public bool IsExactMatchBed { get; set; } = false;

        public bool IsExactMatchBath { get; set; } = false;

        public bool IsDeleted { get; set; } = false;

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public AddressComponentVM[] AddressComponent { get; set; }

        public string AddressType { get; set; }

        public string SearchTerm { get; set; }

        public int From { get; set; }

        public int To { get; set; }
    }

    // public class AddressComponentVM {
    //     public string long_name { get; set; }
    //     public string short_name { get; set; }
    //     public string[] types { get; set; }
    // }
}
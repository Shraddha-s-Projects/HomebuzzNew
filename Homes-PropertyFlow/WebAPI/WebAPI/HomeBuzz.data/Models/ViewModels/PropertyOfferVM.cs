using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels {
    public class PropertyOfferVM {

        public int Id { get; set; }

        public int? PropertyDetailId { get; set; }

        public long? UserId { get; set; }

        public DateTime OfferedOn { get; set; }

        public decimal OfferingAmount { get; set; }

        public string Status { get; set; }

        public string Address { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }

        public bool IsEmailValid { get; set; } = true;

        public string EmailErrorMessage { get; set; }

        public string Name { get; set; }

        public string EmailOrPhone { get; set; }

    }
}
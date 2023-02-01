using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels {
    public class PropertyClaimVM {
        public int Id { get; set; }

        public int? PropertyDetailId { get; set; }

        public DateTime ClaimedOn { get; set; }

        public string Address { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }

        public long? OwnerId { get; set; }

        public bool IsEmailValid { get; set; } = true;

        public string EmailErrorMessage { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models {
    public class InvalidPropertyData {
        [Key, Required]
        public int Id { get; set; }

        public string Address { get; set; }
         public string Suburb { get; set; }
        public string City { get; set; }

        public decimal? HomebuzzEstimate { get; set; }

        public string Bedrooms { get; set; }

        public string Bathrooms { get; set; }

        public string CarSpace { get; set; }

        public string Landarea { get; set; }

        public string LatitudeLongitude { get; set; }
        
        public int? MasterFileUpload { get; set; }
    }
}
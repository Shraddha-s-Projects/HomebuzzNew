using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models {
    public class PropertyCrudData {
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

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public int? PropertyDetailId { get; set; }

       public decimal? AskingPrice { get; set; }
       public string BuildingType { get; set; }
    }
}
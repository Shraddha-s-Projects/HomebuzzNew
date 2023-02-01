using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels {
    public class RankedPropertyVM {
        public long PropertyId { get; set; }
        public long PropertyDetailId { get; set; }
        public long Ranked30 { get; set; }
        public long Ranked60 { get; set; }
        public float Ranked { get; set; }
        public string Status { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public DateTime? LastViewed { get; set; }
    }
}
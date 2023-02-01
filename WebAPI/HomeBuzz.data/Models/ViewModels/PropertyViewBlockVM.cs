using System;
using System.Collections.Generic;

namespace HomeBuzz.data.Models.ViewModels {
    public class PropertyViewBlockVM {
        public int? PropertyDetailId { get; set; }
        public int? ViewCount { get; set; }
    }

    public class PropertyRankedVM {
        public int? PropertyDetailId { get; set; }
        public int? ViewCount { get; set; }
        public int? Ranked { get; set; }
    }

    public class PropertyViewFinalRankedVM {
        public int? PropertyDetailId { get; set; }
        public int? PropertyId { get; set; }
        public int? ViewCount { get; set; }
        public int? Ranked60 { get; set; }
        public int? Ranked30 { get; set; }
        public int? Ranked { get; set; }
        public string Status { get; set; }
        public DateTime? LastViewed { get; set; }
        public List<Property> Last90Views { get; set; }
    }
}
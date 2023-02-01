using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models {
    public class PropertyImage {
        [Key, Required]
        public int Id { get; set; }

        public int? PropertyDetailId { get; set; }

        public string ImageName { get; set; }

    }
}
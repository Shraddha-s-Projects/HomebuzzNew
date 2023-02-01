using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class Country
    {
        [Key, Required]
        public int CountryId { get; set; }

        [StringLength(10)]
        public string CountryCode { get; set; }

        [StringLength(50)]
        public string CountryName { get; set; }

        [StringLength(10)]
        public string PhoneCode { get; set; }
    }
}

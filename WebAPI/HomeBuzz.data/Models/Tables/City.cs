using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class City
    {
        [Key, Required]
        public int CityId { get; set; }

        [StringLength(50)]
        public string CityName { get; set; }

        public int StateId { get; set; }
    }
}

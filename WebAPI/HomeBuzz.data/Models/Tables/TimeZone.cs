using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class TimeZone
    {
        [Key, Required]
        public int TimeZoneId { get; set; }

        public string CountryName { get; set; }

        public string CountryCode { get; set; }

        public string Timezone { get; set; }

        public string UtcOffset { get; set; }

        public string Description { get; set; }
    }
}

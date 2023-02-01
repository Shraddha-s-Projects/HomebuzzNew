using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class State
    {
        [Key, Required]
        public int StateId { get; set; }

        [StringLength(50)]
        public string StateName { get; set; }

        public int CountryId { get; set; }
    }
}

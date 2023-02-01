using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class PropertyStatus
    {
        [Key, Required]
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}

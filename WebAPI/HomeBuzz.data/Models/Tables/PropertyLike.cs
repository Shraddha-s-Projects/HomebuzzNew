using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class PropertyLike
    {
        [Key, Required]
        public int Id { get; set; }

        public int? PropertyDetailId { get; set; }

        public long? UserId { get; set; }

        public DateTime LikedOn { get; set; }

    }
}

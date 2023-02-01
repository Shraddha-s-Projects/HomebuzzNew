using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class UserPasswordHistory
    {
        [Key, Required]
        public long UserPasswordHistoryId { get; set; }

        public long UserId { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public Nullable<DateTime> CreatedOn { get; set; }
    }
}

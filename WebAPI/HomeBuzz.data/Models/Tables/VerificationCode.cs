using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class VerificationCode
    {
        [Key, Required]
        public long VerificationCodeId { get; set; }

        [StringLength(50)]
        public string VerificationFor { get; set; }

        [StringLength(10)]
        public string Code { get; set; }

        public Nullable<long> UserId { get; set; }

        public string Email { get; set; }

        public bool IsUsed { get; set; }

        public bool IsExpired { get; set; }

        public Nullable<DateTime> ExpiredOn { get; set; }

        public DateTime CreatedOn { get; set; }

        public Nullable<DateTime> UpdatedOn { get; set; }

        public bool IsDeleted { get; set; }

        public Nullable<DateTime> DeletedOn { get; set; }
    }
}

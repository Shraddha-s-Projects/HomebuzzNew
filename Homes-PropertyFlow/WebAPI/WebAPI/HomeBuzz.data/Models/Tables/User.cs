using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeBuzz.data.Models {
    public class User {
        [Key, Required]
        public long UserId { get; set; }

        public Guid UserGUID { get; set; }

        public string UserName { get; set; }

        [Required (ErrorMessage = "Email can't be empty")]
        [DataType (DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        [Required]
        public string Password { get; set; }

        public string PasswordHint { get; set; }

        [MaxLength (6, ErrorMessage = "Pin must be 6 digit.")]
        [MinLength (6, ErrorMessage = "Pin must be 6 digit.")]
        [RegularExpression ("^[0-9]*$", ErrorMessage = "Pin must be numeric")]
        public Nullable<int> Pin { get; set; }

        public string ProfilePicPath { get; set; }

        public bool IsEmailVerified { get; set; } = false;

        public Nullable<DateTime> EmailVerifiedOn { get; set; }

        public DateTime CreatedOn { get; set; }

        public int? RoleId { get; set; }

        public int? SubscriptionPlan { get; set; }

        public int? Company { get; set; }

        public string PhoneNo { get; set; }

        public Nullable<DateTime> LastUpdatedOn { get; set; }

        public bool IsActive { get; set; } = false;

        public bool IsDeleted { get; set; } = false;

        public Nullable<DateTime> DeletedOn { get; set; }
    }
}
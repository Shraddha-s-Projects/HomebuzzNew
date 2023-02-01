using System;
using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models {
    public class UserKeyMap {
        [Key, Required]
        public int Id { get; set; }
        public long? UserId { get; set; }
        public string UserKey { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ExpiredOn { get; set; }
    }
}
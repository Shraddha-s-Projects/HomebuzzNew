using System;
using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models
{
    public class MasterFileUpload
    {
        [Key, Required]
        public int Id { get; set; }
        public long? UserId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public bool IsSaved { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? DeletedOn { get; set; }

    }
}
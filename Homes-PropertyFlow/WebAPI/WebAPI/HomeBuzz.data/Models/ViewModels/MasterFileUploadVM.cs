using System;
using Microsoft.AspNetCore.Http;

namespace HomeBuzz.data.Models.ViewModels
{
    public class MasterFileUploadVM
    {
        public int Id { get; set; }
        public long? UserId { get; set; }
        public IFormFile File { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public bool IsSaved { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class SystemSettingCategory
    {
        [Key, Required]
        public int SystemSettingCateogoryId { get; set; }

        [StringLength(50)]
        public string SystemSettingCatName { get; set; }

        [StringLength(4)]
        public string Code { get; set; }

        public Nullable<int> SortOrder { get; set; }

        public bool IsActive { get; set; } = true;

        public Nullable<long> CreatedBy { get; set; }

        public Nullable<DateTime> CreatedOn { get; set; }

        public Nullable<DateTime> LastModifiedOn { get; set; }

        public bool IsDeleted { get; set; } = false;

        public Nullable<DateTime> DeletedOn { get; set; }
    }
}

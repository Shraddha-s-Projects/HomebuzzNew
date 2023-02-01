using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class SystemSetting
    {
        [Key, Required]
        public int SystemSettingId { get; set; }

        public int SystemSettingCategoryId { get; set; }

        [StringLength(5)]
        public string Code { get; set; }

        public int ValueTypeId { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        public string Value { get; set; }

        public bool IsActive { get; set; }

        public Nullable<long> CreatedBy { get; set; }

        public Nullable<DateTime> CreatedOn { get; set; }

        public Nullable<long> LastModifiedBy { get; set; }

        public Nullable<DateTime> LastModifiedOn { get; set; }

        public bool IsDeleted { get; set; }

        public Nullable<DateTime> DeletedOn { get; set; }
    }
}

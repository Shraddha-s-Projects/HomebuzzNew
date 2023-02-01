using HomeBuzz.data.Models;
using HomeBuzz.data.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data
{
    public class SystemSettingVM : CommonResponse
    {
        public SystemSetting SystemSetting { get; set; }
    }

    public class SystemSettingFilter : CommonResponse
    {
        public int PageNum { get; set; }

        public int PageSize { get; set; }

        public int Take { get; set; }

        public int Skip { get; set; }

        public string OrderColumnDir { get; set; }

        public string OrderColumnName { get; set; }

        public string FilterInfoCode { get; set; }

        public string FilterInfoCodeQuery { get; set; }

        public string Query { get; set; }

        public bool IsAssignedContact { get; set; }

        public Nullable<long> TableRecordId { get; set; }

        public int InfoId { get; set; }

        public int CategoryId { get; set; }
    }

    public class SystemSettingResult : CommonResponse
    {
        public int SystemSettingId { get; set; }

        public int SystemSettingCategoryId { get; set; }

        public string Code { get; set; }

        public int ValueTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Value { get; set; }

        public bool IsActive { get; set; }

        public Nullable<long> CreatedBy { get; set; }

        public Nullable<DateTime> CreatedOn { get; set; }

        public Nullable<long> LastModifiedBy { get; set; }

        public Nullable<DateTime> LastModifiedOn { get; set; }

        public bool IsDeleted { get; set; }

        public Nullable<DateTime> DeletedOn { get; set; }

        public long TotalRecords { get; set; }

        public long RowNum { get; set; }
    }
}

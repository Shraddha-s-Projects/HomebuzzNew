using HomeBuzz.data.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class EmailTemplateVM : CommonResponse
    {
        public EmailTemplate EmailTemplate { get; set; }
    }

    public class EmailTemplateResult : CommonResponse
    {

    }

    public class EmailTemplateFilter : CommonResponse
    {
        public int PageNum { get; set; }

        public int Take { get; set; }

        public int Skip { get; set; }

        public string OrderColumnDir { get; set; }

        public string OrderColumnName { get; set; }

        public string FilterInfoCode { get; set; }

        public string FilterInfoCodeQuery { get; set; }

        public string Query { get; set; }

        public Nullable<long> TableRecordId { get; set; }

        public int InfoId { get; set; }

        public string InfoCode { get; set; }
    }
}

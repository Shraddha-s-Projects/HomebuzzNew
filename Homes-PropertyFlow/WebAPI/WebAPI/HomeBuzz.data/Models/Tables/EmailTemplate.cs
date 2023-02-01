using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class EmailTemplate
    {
        [Key, Required]
        public long EmailTemplateId { get; set; }

        [StringLength(100)]
        public string TemplateName { get; set; }

        [StringLength(5)]
        public string TemplateCode { get; set; }

        public string Description { get; set; }

        public string TemplateHtml { get; set; }

        public Nullable<DateTime> CreatedOn { get; set; } = DateTime.UtcNow;

        public Nullable<DateTime> UpdatedOn { get; set; }

        public Nullable<bool> IsDeleted { get; set; } = false;

        public Nullable<DateTime> DeletedOn { get; set; }

    }
}

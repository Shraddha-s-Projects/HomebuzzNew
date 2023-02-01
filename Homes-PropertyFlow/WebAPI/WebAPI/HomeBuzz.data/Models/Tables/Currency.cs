using System;
using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models
{
    public class Currency
    {
        [Key, Required]
        public long CurrencyId { get; set; }

        public string CurrencyCode { get; set; } 

        public string CurrencyName { get; set; }

        public string CurrencySymbol { get; set; }

        public bool IsDefaultCurrency { get; set; }

        public bool IsDeleted { get; set; } = false;

        public Nullable<DateTime> DeletedOn { get; set; }

        public Nullable<DateTime> UpdatedOn { get; set; }
    }
}

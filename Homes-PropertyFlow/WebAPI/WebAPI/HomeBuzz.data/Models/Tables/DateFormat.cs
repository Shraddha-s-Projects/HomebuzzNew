using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models
{
    public class DateFormat
    {
        [Key, Required]
        public long DateFormatId { get; set; }

        public string Format { get; set; }

        public bool IsDefault { get; set; }
    }
}

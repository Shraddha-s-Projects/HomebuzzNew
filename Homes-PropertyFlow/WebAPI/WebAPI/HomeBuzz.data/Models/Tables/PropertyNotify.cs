using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models {
    public class PropertyNotify {
        [Key, Required]
        public int Id { get; set; }
        public int? PropertyDetailId { get; set; }
        public long? UserId { get; set; }
    }
}
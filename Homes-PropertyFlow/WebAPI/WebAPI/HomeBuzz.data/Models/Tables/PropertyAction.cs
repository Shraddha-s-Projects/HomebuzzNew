using System.ComponentModel.DataAnnotations;
namespace HomeBuzz.data.Models
{
    public class PropertyAction
    {
        [Key, Required]
        public int Id { get; set; }
        public string Action { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
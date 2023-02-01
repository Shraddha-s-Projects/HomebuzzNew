using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models.Tables
{
    public class UserRoles
    {
        [Key, Required]
        public int Id { get; set; }
        public string Role { get; set; }
    }
}
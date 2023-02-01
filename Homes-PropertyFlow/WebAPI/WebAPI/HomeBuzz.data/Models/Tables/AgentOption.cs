using System.ComponentModel.DataAnnotations;

namespace HomeBuzz.data.Models.Tables
{
    public class AgentOption
    {
         [Key, Required]
        public int Id { get; set; }
        public string Option { get; set; }
    }
}
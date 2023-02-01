using System;
namespace HomeBuzz.data.Models.ViewModels
{
    public class PropertyOwnershipHistoryVM
    {
        public int Id { get; set; }
        public int? ClaimId { get; set; }
        public int? PropertyDetailId { get; set; }
        public string Email { get; set; }
        public long? FromOwnerId { get; set; }
        public long? ToOwnerId { get; set; }
        public int? Action { get; set; }
        public string Address { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }
        public bool IsEmailValid { get; set; } = true;
        public string EmailErrorMessage { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
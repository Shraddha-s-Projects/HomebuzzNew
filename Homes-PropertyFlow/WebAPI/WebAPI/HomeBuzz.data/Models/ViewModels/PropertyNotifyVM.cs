using System;
namespace HomeBuzz.data.Models.ViewModels {
    public class PropertyNotifyVM {
        public int Id { get; set; }
        public int? PropertyDetailId { get; set; }
        public long? UserId { get; set; }
        public string Email { get; set; }
        public bool IsUserAlreadyExist { get; set; }
        public bool IsEmailValid { get; set; } = true;
        public string EmailErrorMessage { get; set; }
        public string Day { get; set; }
        public string Time { get; set; }
        public string Address { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }
        public DateTime OpenedDate { get; set; }
    }
}
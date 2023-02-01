namespace HomeBuzz.data.Models.ViewModels
{
    public class PaymentVM
    {
        public int? Id { get; set; }
        public long? UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public decimal Amount { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
        public string Intent { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string PayPalClientId { get; set; }
        public string PayPalClientSecret { get; set; }
    }
}
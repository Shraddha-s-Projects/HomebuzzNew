namespace HomeBuzz.data.Models.ViewModels {
    public class BillingPlanVM {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public decimal? Amount { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string PayPalClientId { get; set; }
        public string PayPalClientSecret { get; set; }
        public string start_date { get; set; }
    }
}
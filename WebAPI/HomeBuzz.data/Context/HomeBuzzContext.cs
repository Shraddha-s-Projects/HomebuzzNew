using HomeBuzz.data.Mapping;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using Microsoft.EntityFrameworkCore;

namespace HomeBuzz.data {
    public partial class HomeBuzzContext : DbContext {
        public static string ConnectionString { get; set; }
        public static string CurrentURL { get; set; }
        public static string SecretKey { get; set; }
        public static string AppURL { get; set; }
        public static string TokenExpireMinute { get; set; }
        public static string PayPalClientId { get; set; }
        public static string PayPalClientSecret { get; set; }
        public HomeBuzzContext (DbContextOptions<HomeBuzzContext> options) : base (options) {
            Database.SetCommandTimeout (150000);
        }
        public HomeBuzzContext () {

        }

        protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder) {
            // optionsBuilder.UseSqlServer ("Data Source=homebuzz.database.windows.net;Initial Catalog=HomeBuzzLive;User Id=homebuzz_admin;Password=database@123;"); //Live
            // optionsBuilder.UseSqlServer ("Data Source=tcp:203.192.235.219,49172,49172;Initial Catalog=HomebuzzLocal;User Id=sa;Password=Admin@123;"); //ta15
            // optionsBuilder.UseSqlServer ("Server=localhost\\SQLEXPRESS;Database=HomeBuzzLocal;Trusted_Connection=True;"); //Local Shraddha PC
            optionsBuilder.UseSqlServer (ConnectionString);
        }

        public DbSet<User> User { get; set; }
        public DbSet<ErrorLog> ErrorLog { get; set; }
        //public DbSet<City> City { get; set; }
        //public DbSet<State> State { get; set; }
        //public DbSet<Country> Country { get; set; }
        //public DbSet<TimeZone> TimeZone { get; set; }
        //public DbSet<Currency> Currency { get; set; }
        //public DbSet<DateFormat> DateFormat { get; set; }
        public DbSet<EmailTemplate> EmailTemplate { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<SystemSetting> SystemSetting { get; set; }
        public DbSet<SystemSettingCategory> SystemSettingCategory { get; set; }
        public DbSet<UserPasswordHistory> UserPasswordHistory { get; set; }
        public DbSet<VerificationCode> VerificationCode { get; set; }
        /* CUSTOM START */

        public DbSet<PropertyData> PropertyData { get; set; }
        public DbSet<PropertyDetail> PropertyDetail { get; set; }
        public DbSet<PropertyClaim> PropertyClaim { get; set; }
        public DbSet<PropertyOffer> PropertyOffer { get; set; }
        public DbSet<PropertyLike> PropertyLike { get; set; }
        public DbSet<PropertyCrudData> PropertyCrudData { get; set; }
        public DbSet<PropertyImage> PropertyImage { get; set; }
        public DbSet<PropertyView> PropertyView { get; set; }
        public DbSet<PropertyStatus> PropertyStatus { get; set; }
        public DbSet<BuzzPeriod> BuzzPeriod { get; set; }
        public DbSet<PropertySearchHistory> PropertySearchHistory { get; set; }
        public DbSet<PropertyNotify> PropertyNotify { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<AgentOption> AgentOption { get; set; }
        public DbSet<PropertyAgent> PropertyAgent { get; set; }
        public DbSet<PropertyOwnershipHistory> PropertyOwnershipHistory { get; set; }
        public DbSet<PropertyAction> PropertyAction { get; set; }
        public DbSet<SubscriptionPlan> SubscriptionPlan { get; set; }
        public DbSet<SubscriptionPlanDetail> SubscriptionPlanDetail { get; set; }
        public DbSet<Company> Company { get; set; }
        public DbSet<AgentPayment> AgentPayment { get; set; }
        public DbSet<UserKeyMap> UserKeyMap { get; set; }
        public DbSet<MasterFileUpload> MasterFileUpload { get; set; }
        public DbSet<TempMasterData> TempMasterData { get; set; }
        public DbSet<InvalidPropertyData> InvalidPropertyData { get; set; }

        public DbSet<PropertyFlowInterestHourly> PropertyFlowInterestHourly { get; set; }
        public DbSet<PropertyFlowInterestDaily> PropertyFlowInterestDaily { get; set; }
        public DbSet<PropertyFlowInterestWeekly> PropertyFlowInterestWeekly { get; set; }

        public DbSet<TimeWeightedPropertyFlowInterestHourly> TimeWeightedPropertyFlowInterestHourly { get; set; }
        public DbSet<TimeWeightedPropertyFlowInterestDaily> TimeWeightedPropertyFlowInterestDaily { get; set; }
        public DbSet<TimeWeightedPropertyFlowInterestWeekly> TimeWeightedPropertyFlowInterestWeekly { get; set; }
 
        // public DbSet<PropertyFlowInterest> PropertyFlowInterest { get; set; }

        /* CUSTOM END */

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            new UserMap (modelBuilder.Entity<User> ());
            new PropertyDataMap (modelBuilder.Entity<PropertyData> ());
            new PropertyCrudDataMap (modelBuilder.Entity<PropertyCrudData> ());
            new BuzzPeriodMap (modelBuilder.Entity<BuzzPeriod> ());
            new PropertySearchHistoryMap (modelBuilder.Entity<PropertySearchHistory> ());
            new PropertyViewMap (modelBuilder.Entity<PropertyView> ());
            new TempMasterDataMap (modelBuilder.Entity<TempMasterData> ());
        }
    }
}
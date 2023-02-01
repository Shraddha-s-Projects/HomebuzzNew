using System;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Hangfire;
using Hangfire.MemoryStorage;
using Hangfire.SqlServer;
using HomeBuzz.data;
using HomeBuzz.data.ConfigOptions;
using HomeBuzz.data.Service;
using HomeBuzz.helper;
using HomeBuzz.jwt.authentication;
using HomeBuzz.logic;
using HomeBuzz.logic.BusinessLogic;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using WebSocketManager;

namespace HomeBuzz.api {
    public class Startup {
        public IContainer ApplicationContainer { get; private set; }
        private IHostingEnvironment HostingEnvironment { get; set; }
        public IConfigurationRoot Configuration { get; }
        private readonly DeactiveProperty property;
        private readonly PropertyFlowInterestTimeIntervalLogic propertyFlowInterest;

        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyOfferService _propertyOfferService;
        private readonly IPropertyClaimService _propertyClaimService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;
        private readonly IPropertyLikeService _propertyLikeService;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IPropertyImageService _propertyImageService;
        private readonly IPropertyNotifyService _propertyNotifyService;
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly IPropertyFlowInterestService _propertyFlowInterestService;
        private readonly IPropertyFlowInterestHourlyService _propertyFlowInterestHourlyService;
        private readonly IPropertyFlowInterestDailyService _propertyFlowInterestDailyService;
        private readonly IPropertyFlowInterestWeeklyService _propertyFlowInterestWeeklyService;

        private PropertyOfferMail propertyOfferMail;
        private HomeBuzzContext context;

        private string CurrentURL { get; set; }
        private string ConnectionString {
            get {
                return this.HostingEnvironment.IsDevelopment () ? Configuration.GetConnectionString ("DefaultConnection") : Configuration.GetConnectionString ("DefaultConnection");
            }
        }

        public Startup (IHostingEnvironment env) {
            var builder = new ConfigurationBuilder ()
                .SetBasePath (env.ContentRootPath)
                .AddJsonFile ("appsettings.json", optional : true, reloadOnChange : true)
                .AddJsonFile ($"appsettings.{env.EnvironmentName}.json", optional : true, reloadOnChange : true)
                .AddEnvironmentVariables ();

            Configuration = builder.Build ();
            this.HostingEnvironment = env;
            property = new DeactiveProperty (_propertyDetailService, _propertyOfferService, _propertyClaimService,
                _propertyCrudDataService, _propertyLikeService, _propertyViewService, _propertyImageService, _propertyNotifyService,
                _userService, _emailTemplateService, context);

            propertyFlowInterest = new PropertyFlowInterestTimeIntervalLogic (_propertyFlowInterestService,
                _propertyFlowInterestHourlyService,
                _propertyFlowInterestDailyService,
                _propertyFlowInterestWeeklyService,
                _propertyViewService, _propertyDetailService, _propertyCrudDataService);
        }

        public IServiceProvider ConfigureServices (IServiceCollection services) {
            // Add the whole configuration object here.
            services.AddSingleton<IConfiguration> (Configuration);

            // Add framework services.
            services.AddDbContext<HomeBuzzContext> (options =>
                options.UseSqlServer (this.ConnectionString));

            HomeBuzzContext.ConnectionString = this.ConnectionString;
            HomeBuzzContext.SecretKey = Configuration.GetSection ("JwtConfig:SecretKey").Value;
            HomeBuzzContext.CurrentURL = Configuration.GetSection ("JwtConfig:ValidIssuer").Value;
            HomeBuzzContext.AppURL = Configuration.GetSection ("JwtConfig:ValidAudience").Value;
            HomeBuzzContext.TokenExpireMinute = Configuration.GetSection ("JwtConfig:TokenExpireMinute").Value;
            HomeBuzzContext.PayPalClientId = Configuration.GetSection ("PayPalClientId").Value;
            HomeBuzzContext.PayPalClientSecret = Configuration.GetSection ("PayPalClientSecret").Value;

            services.AddHangfire (c => c.UseMemoryStorage ());

            //	Add Hangfire services.

            services.AddHangfire (configuration => configuration
                .SetDataCompatibilityLevel (CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer ()
                .UseRecommendedSerializerSettings ()
                //.UseSqlServerStorage ("Data Source=tcp:192.168.1.15\\TA15,49172;Initial Catalog=Homebuzz;User Id=sa;Password=Admin@123;", new SqlServerStorageOptions 
                .UseSqlServerStorage (Configuration.GetConnectionString ("DefaultConnection"), new SqlServerStorageOptions {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes (5),
                        SlidingInvisibilityTimeout = TimeSpan.FromMinutes (5),
                        QueuePollInterval = TimeSpan.Zero,
                        UseRecommendedIsolationLevel = true,
                        UsePageLocksOnDequeue = true,
                        DisableGlobalLocks = true
                }));

            //	Add the processing server as IHostedService
            services.AddHangfireServer ();

            services.AddMvc ()
                .AddJsonOptions (options => options.SerializerSettings.ContractResolver = new DefaultContractResolver ());
            services.AddDistributedMemoryCache ();
            services.AddSession ();

            services.AddSingleton<IPaypalServices, PaypalServices> ();
            services.Configure<PayPalAuthOptions> (Configuration);
            // JWT - Start
            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer (options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration.GetSection ("JwtConfig:ValidIssuer").Value,
                    ValidAudience = Configuration.GetSection ("JwtConfig:ValidAudience").Value,
                    IssuerSigningKey = JwtSecurityKey.Create (Configuration.GetSection ("JwtConfig:SecretKey").Value)
                    };

                    options.Events = new JwtBearerEvents {
                        OnAuthenticationFailed = context => {
                                Console.WriteLine ("OnAuthenticationFailed: " + context.Exception.Message);
                                return Task.CompletedTask;
                            },
                            OnTokenValidated = context => {
                                // Console.WriteLine("OnTokenValidated: " + context.SecurityToken);
                                return Task.CompletedTask;
                            }
                    };
                });

            services.AddAuthorization (options => {
                options.AddPolicy ("Member",
                    policy => policy.RequireClaim ("sid"));
            });
            // JWT - End

            // Websocket
            services.AddWebSocketManager ();

            // create a Autofac container builder
            var builder = new ContainerBuilder ();

            // read service collection to Autofac
            builder.Populate (services);

            // use and configure Autofac
            builder.RegisterType<UnitOfWork> ().As<IUnitOfWork> ().InstancePerDependency ();
            builder.RegisterType<DbFactory> ().As<IDbFactory> ().InstancePerDependency ();

            builder.RegisterAssemblyTypes (typeof (UserRepository).Assembly)
                .Where (t => t.Name.EndsWith ("Repository"))
                .AsImplementedInterfaces ().InstancePerDependency ();

            builder.RegisterAssemblyTypes (typeof (UserService).Assembly)
                .Where (t => t.Name.EndsWith ("Service"))
                .AsImplementedInterfaces ().InstancePerDependency ();

            builder.RegisterType<IFormFile> ()
                .AsImplementedInterfaces ().InstancePerDependency ();

            // build the Autofac container
            ApplicationContainer = builder.Build ();

            // creating the IServiceProvider out of the Autofac container
            return new AutofacServiceProvider (ApplicationContainer);
        }

        public void ConfigureContainer (ContainerBuilder builder) {
            builder.RegisterModule (new AutofacModule ());
        }

        public void Configure (IApplicationBuilder app, IServiceProvider serviceProvider, IHostingEnvironment env, ILoggerFactory loggerFactory, HomeBuzzContext context, IBackgroundJobClient backgroundJobs) {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory> ().CreateScope ()) {
                HomeBuzzContext.ConnectionString = Configuration.GetConnectionString ("DefaultConnection");
                serviceScope.ServiceProvider.GetService<HomeBuzzContext> ()
                    .Database.Migrate ();
            }

            GlobalConfiguration.Configuration

                .UseSqlServerStorage(this.ConnectionString);

            app.UseHangfireDashboard ();
            // backgroundJobs.Enqueue (() => Console.WriteLine ("Hello world from Hangfire!"));
            // backgroundJobs.Enqueue (() => Console.WriteLine ("Fire-and-forget!"));
            // backgroundJobs.Schedule (
            //     () => Console.WriteLine ("Delayed!"),
            //     TimeSpan.FromMinutes (1));

            // RecurringJob.AddOrUpdate (
            //     () => property.GetAllDeActivateProperty (),
            //     Cron.Daily (10, 55));

            RecurringJob.AddOrUpdate (
                () => property.GetAllDeActivateProperty (),
                Cron.Minutely ());

            // RecurringJob.AddOrUpdate (
            //     () => propertyFlowInterest.AddUpdate (),
            //     Cron.MinuteInterval (5));

            RecurringJob.AddOrUpdate (
                () => propertyFlowInterest.AddUpdate (FlowInterestType.Hourly.ToString ()),
                Cron.HourInterval (1));

            // Run every day at 00:00 AM
            RecurringJob.AddOrUpdate (
                () => propertyFlowInterest.AddUpdateDaily (FlowInterestType.Daily.ToString ()),
                Cron.Daily (23, 59));

            RecurringJob.AddOrUpdate (
                () => propertyFlowInterest.AddUpdateWeekly (FlowInterestType.Weekly.ToString ()),
                Cron.Weekly (DayOfWeek.Sunday, 23, 59));

            // logic for method call every day 1:30 AM
            RecurringJob.AddOrUpdate (
                () => property.GetAllPropertyNotify (),
                Cron.Daily (18, 00));

            // RecurringJob.AddOrUpdate (
            //     () => property.GetAllPropertyNotify (),
            //     Cron.MinuteInterval (5));

            //Cors
            app.UseCors (builder => {
                builder.AllowAnyHeader ();
                builder.AllowAnyMethod ();
                builder.AllowCredentials ();
                builder.AllowAnyOrigin (); // For anyone access.
            });

            loggerFactory.AddConsole (Configuration.GetSection ("Logging"));
            loggerFactory.AddDebug ();

            // Web Socket 
            app.UseWebSockets ();

            app.UseAuthentication ();
            app.UseStaticFiles ();
            app.UseSession ();
            app.UseMvc ();

            DbInitializer.Initialize (context);
            app.MapWebSocketManager ("/notifications", serviceProvider.GetService<NotificationsMessageHandler> ());
        }
    }
}
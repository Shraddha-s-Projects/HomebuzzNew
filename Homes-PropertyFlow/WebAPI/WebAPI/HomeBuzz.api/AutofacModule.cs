using Autofac;
using HomeBuzz.data;
using Microsoft.Extensions.Logging;

namespace HomeBuzz.api
{
    public class AutofacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            // The generic ILogger<TCategoryName> service was added to the ServiceCollection by ASP.NET Core.
            // It was then registered with Autofac using the Populate method in ConfigureServices.
            // builder.Register(c => new AirportService(c.Resolve<ILogger<AirportService>>()))
            //     .As<IAirportService>()
            //     .InstancePerRequest();

            // builder.Register(c => new AirportService(c.Resolve<ILogger<AirportService>>()))
            //     .As<IAirportService>()
            //     .InstancePerRequest();

            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>().InstancePerLifetimeScope();
            builder.RegisterType<DbFactory>().As<IDbFactory>().InstancePerLifetimeScope();
            
            // builder.RegisterType<AirportRepository>().As<IAirportRepository>().InstancePerLifetimeScope();
            // builder.RegisterType<AirportService>().As<IAirportService>().InstancePerLifetimeScope();
            // builder.RegisterType<FlightRepository>().As<IFlightRepository>().InstancePerLifetimeScope();
            // builder.RegisterType<FlightService>().As<IFlightService>().InstancePerLifetimeScope();            
        }
    }
}
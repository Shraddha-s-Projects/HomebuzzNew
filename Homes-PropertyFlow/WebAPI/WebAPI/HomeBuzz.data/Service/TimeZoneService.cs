using HomeBuzz.data.Models;

namespace HomeBuzz.data
{
    public partial class TimeZoneService : ServiceBase<TimeZone>, ITimeZoneService
    {
        public TimeZoneService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }
    }

    public partial interface ITimeZoneService : IService<TimeZone>
    {

    }
}

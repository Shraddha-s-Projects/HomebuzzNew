using HomeBuzz.data;
using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HomeBuzz.data
{
    public partial class DateFormatService : ServiceBase<DateFormat>, IDateFormatService
    {
        public DateFormatService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public List<DateFormat> GetAllDateFormat(long userId)
        {
            return GetAllAsync().Result.ToList();
        }

    }

    public partial interface IDateFormatService : IService<DateFormat>
    {
        List<DateFormat> GetAllDateFormat(long userId);
    }

}

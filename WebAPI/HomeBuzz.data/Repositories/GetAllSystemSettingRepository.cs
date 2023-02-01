using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.ViewModels;

namespace HomeBuzz.data
{
    public partial class GetAllSystemSettingRepository : RepositoryBase<SystemSettingFilter>, IGetAllSystemSettingRepository
    {
        public GetAllSystemSettingRepository(IDbFactory _dbFactory) : base(_dbFactory)
        {

        }
    }

    public partial interface IGetAllSystemSettingRepository : IRepository<SystemSettingFilter>
    {

    }
}


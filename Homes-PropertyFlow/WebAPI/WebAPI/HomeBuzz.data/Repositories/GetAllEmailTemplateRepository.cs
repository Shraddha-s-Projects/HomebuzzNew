using HomeBuzz.data.Models;
using HomeBuzz.data.ViewModels;

namespace HomeBuzz.data
{
    public partial class GetAllEmailTemplateRepository : RepositoryBase<EmailTemplateFilter>, IGetAllEmailTemplateRepository
    {
        public GetAllEmailTemplateRepository(IDbFactory _dbFactory) : base(_dbFactory)
        {

        }
    }

    public partial interface IGetAllEmailTemplateRepository : IRepository<EmailTemplateFilter>
    {

    }
}

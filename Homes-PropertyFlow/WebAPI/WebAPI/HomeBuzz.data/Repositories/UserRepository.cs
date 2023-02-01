namespace HomeBuzz.data
{
    using HomeBuzz.data.Models;

    public partial class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(IDbFactory _dbFactory) : base(_dbFactory)
        {

        }
    }

    public partial interface IUserRepository : IRepository<User>
    {
    }
}
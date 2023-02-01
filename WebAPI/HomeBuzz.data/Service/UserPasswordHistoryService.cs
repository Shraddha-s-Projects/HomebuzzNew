using HomeBuzz.data.Models;
using System.Linq;

namespace HomeBuzz.data
{
    public partial class UserPasswordHistoryService : ServiceBase<UserPasswordHistory>, IUserPasswordHistoryService
    {
        public UserPasswordHistoryService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public UserPasswordHistory InsertUserPasswordHistory(UserPasswordHistory userPasswordHistory)
        {
            var newItem = Add(userPasswordHistory);
            SaveAsync();

            return newItem;
        }
    }

    public partial interface IUserPasswordHistoryService : IService<UserPasswordHistory>
    {
        UserPasswordHistory InsertUserPasswordHistory(UserPasswordHistory userPasswordHistory);
    }
}

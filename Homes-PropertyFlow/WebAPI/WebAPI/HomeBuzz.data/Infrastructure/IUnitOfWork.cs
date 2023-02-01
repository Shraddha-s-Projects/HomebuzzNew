using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace HomeBuzz.data
{


    public interface IUnitOfWork
    {
        Task Commit();

        Task CommitAsync();

        void BeginTransaction();

        void Rollback();

        //DbRawSqlQuery<T> SQLQuery<T>(string sql, params object[] parameters);
    }
}
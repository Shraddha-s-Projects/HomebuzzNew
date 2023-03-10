
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace HomeBuzz.data
{
    public interface IService<T> where T : class
    {
        Task<IQueryable<T>> GetAllAsync();

        Task<IQueryable<T>> FindAllAsync(Expression<Func<T, bool>> match);

        Task<T> GetAsync(int id);

        T Add(T entity);

        Task<T> UpdateAsync(T entity, int key);

        Task<T> UpdateAsync(T entity, long key);

        void Delete(T entity);

        Task SaveAsync();

        Task<T> UpdateAsync(T entity, String key);

        Task<T> GetAsync(String id);

        void BeginTransaction();

        void Rollback();

        Task Commit();

        Task<IQueryable<T>> GetMany(Expression<Func<T, bool>> where);

        Task<IList<T>> GetAllListAsnc();
    }
}
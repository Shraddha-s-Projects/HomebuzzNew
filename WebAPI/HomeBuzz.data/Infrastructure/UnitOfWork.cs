using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage;

namespace HomeBuzz.data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbFactory dbFactory;
        private HomeBuzzContext dbContext;
        private IDbContextTransaction _transaction;       

        public UnitOfWork(IDbFactory dbFactory)
        {
            this.dbFactory = dbFactory;
        }

        public HomeBuzzContext DbContext
        {
            get { return dbContext ?? (dbContext = dbFactory.Init()); }
        }

        public void BeginTransaction()
        {
            _transaction = DbContext.Database.BeginTransaction();
        }

        public void Rollback()
        {
            if (_transaction != null)
                _transaction.Rollback();
        }

        public async Task Commit()
        {
            try
            {
                await DbContext.SaveChangesAsync();
                if (_transaction != null)
                    _transaction.Commit();
            }
            catch (Exception ex)
            {
                if (_transaction != null)
                    _transaction.Rollback();
            }
        }

        public async Task CommitAsync()
        {
            await DbContext.SaveChangesAsync();
        }
    }
}
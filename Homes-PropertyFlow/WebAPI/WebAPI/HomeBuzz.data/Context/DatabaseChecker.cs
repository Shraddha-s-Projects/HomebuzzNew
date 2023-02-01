namespace HomeBuzz.data
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Infrastructure;
    using Microsoft.EntityFrameworkCore.Storage;
    using Microsoft.Extensions.Configuration;

    public sealed class DatabaseChecker
    {
        private IConfigurationRoot _configuration;

        public DatabaseExistenceState DatabaseExists(DbContext context)
        {
            try
            {
                var isExist = (context.GetService<IDatabaseCreator>() as RelationalDatabaseCreator).Exists();

                if (isExist)
                {
                    return DatabaseExistenceState.Exists;
                }
                else
                {
                    return DatabaseExistenceState.DoesNotExist;
                }
            }
            catch
            {
                return DatabaseExistenceState.DoesNotExist;
            }
        }
    }
    public enum DatabaseExistenceState
    {
        Unknown,
        DoesNotExist,
        ExistsConsideredEmpty,
        Exists
    }
}
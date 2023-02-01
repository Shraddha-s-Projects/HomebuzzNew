using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Repositories
{
    public partial class PropertyClaimRepositiry :RepositoryBase<PropertyClaim>,IPropertyClaimRepository
    {
        public PropertyClaimRepositiry(IDbFactory _dbFactory) : base(_dbFactory)
        {
        }
    }

    public partial interface IPropertyClaimRepository : IRepository<PropertyClaim>
    {
    }
}

using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Repositories
{
    public partial class PropertyOfferRepository : RepositoryBase<PropertyOffer>
    {
        public PropertyOfferRepository(IDbFactory _dbFactory) : base(_dbFactory)
        {
        }
    }

    public partial interface IPropertyOfferRepository : IRepository<PropertyOffer>
    {
    }
}

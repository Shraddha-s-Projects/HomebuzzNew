using HomeBuzz.data.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data
{
    public partial class PropertyRepository : RepositoryBase<Property>, IPropertyRepository
    {
        public PropertyRepository(IDbFactory _dbFactory) : base(_dbFactory)
        {

        }
    }

    public partial interface IPropertyRepository : IRepository<Property>
    {

    }
}

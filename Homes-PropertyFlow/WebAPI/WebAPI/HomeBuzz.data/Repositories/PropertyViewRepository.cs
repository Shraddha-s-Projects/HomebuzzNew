using HomeBuzz.data.Models.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Repositories
{
	public partial class PropertyViewRepository : RepositoryBase<PropertyView>
	{
		public PropertyViewRepository(IDbFactory _dbFactory) : base(_dbFactory)
		{
		}
	}

	public partial interface IPropertyViewRepository : IRepository<PropertyView>
	{
	}
}

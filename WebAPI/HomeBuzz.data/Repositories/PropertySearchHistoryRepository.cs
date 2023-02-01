using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Repositories
{
	public partial class PropertySearchHistoryRepository : RepositoryBase<PropertySearchHistory>
	{
		public PropertySearchHistoryRepository(IDbFactory _dbFactory) : base(_dbFactory)
		{
		}
	}

	public partial interface IPropertySearchHistoryRepository : IRepository<PropertySearchHistory>
	{
	}
}

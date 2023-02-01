using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;


namespace HomeBuzz.data
{
    public partial class CountryService : ServiceBase<Country>, ICountryService
    {
        public CountryService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }
        public Country CheckInsertOrUpdate(Country country)
        {
            var existingItem = GetMany(t => t.CountryId == country.CountryId).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateCountry(existingItem, country);
            }
            else
            {
                return InsertCountry(country);
            }
        }

        public Country InsertCountry(Country country)
        {
            var newItem = Add(country);
            SaveAsync();

            return newItem;
        }

        public Country UpdateCountry(Country existingItem, Country country)
        {
            UpdateAsync(existingItem, existingItem.CountryId);
            SaveAsync();

            return existingItem;
        }

        public List<Country> GetAllCountry(long userId)
        {
            return GetAllAsync().Result.ToList();
        }

        public Country GetCountryById(int countryId)
        {
            return GetMany(x => x.CountryId == countryId).Result.FirstOrDefault();
        }
    }
    public partial interface ICountryService : IService<Country>
    {
        Country CheckInsertOrUpdate(Country country);

        List<Country> GetAllCountry(long userId);

        Country GetCountryById(int countryId);
    }
}



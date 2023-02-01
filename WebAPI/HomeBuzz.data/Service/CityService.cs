using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HomeBuzz.data
{
    public partial class CityService : ServiceBase<City>, ICityService
    {
        public CityService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }
        public City CheckInsertOrUpdate(City city)
        {
            var existingItem = GetMany(t => t.CityId == city.CityId).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateCity(existingItem, city);
            }
            else
            {
                return InsertCity(city);
            }
        }
        public City InsertCity(City city)
        {
            var newItem = Add(city);
            SaveAsync();

            return newItem;
        }
        public City UpdateCity(City existingItem, City city)
        {
         
            UpdateAsync(existingItem, existingItem.CityId);
            SaveAsync();

            return existingItem;
        }
        public List<City> GetAllCity(long userId, long stateId)
        {
            return GetMany(x => x.StateId == stateId).Result.ToList();
        }

        public City GetCityById(int cityId)
        {
            return GetMany(x => x.CityId == cityId).Result.FirstOrDefault();
        }
    }
    public partial interface ICityService : IService<City>
    {
        City CheckInsertOrUpdate(City city);

        List<City> GetAllCity(long userId, long stateId);

        City GetCityById(int cityId);
    }
}

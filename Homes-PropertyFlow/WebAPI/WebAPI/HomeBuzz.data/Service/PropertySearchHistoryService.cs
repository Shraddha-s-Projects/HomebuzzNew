using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;

namespace HomeBuzz.data {
    public partial class PropertySearchHistoryService : ServiceBase<PropertySearchHistory>, IPropertySearchHistoryService {
        public PropertySearchHistoryService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public PropertySearchHistory CheckInsertOrUpdate (PropertySearchHistory propSearchHistory) {
            var existingItem = GetMany (t => t.Id == propSearchHistory.Id && t.IsDeleted == false).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdatePropertySearchHistory (existingItem, propSearchHistory);
            } else {
                return InsertPropertySearchHistory (propSearchHistory);
            }
        }

        public PropertySearchHistory InsertPropertySearchHistory (PropertySearchHistory propSearchHistory) {
            var newItem = Add (propSearchHistory);
            SaveAsync ();

            return newItem;
        }

        public PropertySearchHistory UpdatePropertySearchHistory (PropertySearchHistory existingItem, PropertySearchHistory PropSearchHistory) {
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public List<PropertySearchHistory> GetAllPropertySearchByUser (Int64 userId) {
            return GetMany (x => x.UserId == userId && x.IsDeleted == false).Result.ToList ();
        }

        public PropertySearchHistory GetPropertySearchById (Int64 searchId) {
            return GetMany (x => x.Id == searchId && x.IsDeleted == false).Result.FirstOrDefault ();
        }

        public PropertySearchHistory RemovePropertySearchHistory (PropertySearchHistory propSearchHistory) {
            propSearchHistory.IsDeleted = true;
            UpdateAsync (propSearchHistory, propSearchHistory.Id);
            SaveAsync ();
            return propSearchHistory;
        }
    }

    public partial interface IPropertySearchHistoryService : IService<PropertySearchHistory> {
        PropertySearchHistory CheckInsertOrUpdate (PropertySearchHistory propSearchHistory);

        List<PropertySearchHistory> GetAllPropertySearchByUser (Int64 userId);

        PropertySearchHistory RemovePropertySearchHistory (PropertySearchHistory propSearchHistory);

        PropertySearchHistory GetPropertySearchById (Int64 searchId);

    }
}
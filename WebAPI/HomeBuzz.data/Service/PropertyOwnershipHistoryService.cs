using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {
    public class PropertyOwnershipHistoryService : ServiceBase<PropertyOwnershipHistory>, IPropertyOwnershipHistoryService {
        public PropertyOwnershipHistoryService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }
        public PropertyOwnershipHistory CheckInsertOrUpdate (PropertyOwnershipHistory ownerHistory) {
            var existingItem = GetMany (t => t.Id == ownerHistory.Id).Result.FirstOrDefault ();
            if (existingItem != null) {
                return UpdateOwnershipHistory (existingItem, ownerHistory);
            } else {
                return InsertOwnershipHistory (ownerHistory);
            }
        }

        private PropertyOwnershipHistory InsertOwnershipHistory (PropertyOwnershipHistory ownerHistory) {
            // property.ViewCount = 1; // default set as 1
            ownerHistory.CreatedOn = DateTime.Now;
            var newItem = Add (ownerHistory);
            SaveAsync ();

            return newItem;
        }
        private PropertyOwnershipHistory UpdateOwnershipHistory (PropertyOwnershipHistory existingItem, PropertyOwnershipHistory property) {
            UpdateAsync (existingItem, property.Id);
            SaveAsync ();

            return existingItem;
        }

        public List<PropertyOwnershipHistory> GetHistoryByDetailId (int PropertyDetailId) {
          return GetMany (t => t.PropertyDetailId.Value == PropertyDetailId).Result.ToList ();
        }

    }

    public partial interface IPropertyOwnershipHistoryService : IService<PropertyOwnershipHistory> {

        PropertyOwnershipHistory CheckInsertOrUpdate (PropertyOwnershipHistory ownerHistory);
        List<PropertyOwnershipHistory> GetHistoryByDetailId (int PropertyDetailId);
    }
}
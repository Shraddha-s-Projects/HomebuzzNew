using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class PropertyFlowInterestDailyService : ServiceBase<PropertyFlowInterestDaily>, IPropertyFlowInterestDailyService
    {
        public PropertyFlowInterestDailyService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<PropertyFlowInterestDaily> GetAllPropertyFlowInterestsDaily() {
            return GetAllAsync ().Result.ToList ();
        }

        public List<PropertyFlowInterestDaily> GetAllPropertyFlowInterestByPropertyDetailIdLast28Days(int PropertyDetailId) {
            // var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-1440);
            var last28Days = DateTime.UtcNow.AddDays (-28);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last28Days).Result.ToList ();
        }

        public PropertyFlowInterestDaily CheckInsertOrUpdate (PropertyFlowInterestDaily PropertyFlowInterestDaily) {
            var existingItem = GetMany (t => t.PropertyDetailId == PropertyFlowInterestDaily.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdatePropertyFlowInterestDaily (existingItem, PropertyFlowInterestDaily);
            } else {
                return InsertPropertyFlowInterestDaily(PropertyFlowInterestDaily);
            }
        }
        public PropertyFlowInterestDaily InsertPropertyFlowInterestDaily (PropertyFlowInterestDaily PropertyFlowInterestDaily) {
            PropertyFlowInterestDaily.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterestDaily);
            SaveAsync ();

            return newItem;
        }

        public PropertyFlowInterestDaily CheckLast28DaysExistProperty(PropertyFlowInterestDaily  PropertyFlowInterestDaily) {
            // var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-120);
              var past28Days = DateTime.UtcNow.AddDays (-28);
            var existItemList = GetMany (t => t.PropertyDetailId == PropertyFlowInterestDaily.PropertyDetailId && t.CreatedOn < past28Days).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            PropertyFlowInterestDaily.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterestDaily);
            SaveAsync ();
            return newItem;
        }


        public PropertyFlowInterestDaily UpdatePropertyFlowInterestDaily(PropertyFlowInterestDaily existingItem, PropertyFlowInterestDaily PropertyFlowInterestDaily) {
            // existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public PropertyFlowInterestDaily RemovePropertyFlowInterestDaily(PropertyFlowInterestDaily PropertyFlowInterestDaily) {
            Delete (PropertyFlowInterestDaily);
            SaveAsync ();
            return PropertyFlowInterestDaily;
        }

    }

    public partial interface IPropertyFlowInterestDailyService : IService<PropertyFlowInterestDaily> {
        List<PropertyFlowInterestDaily> GetAllPropertyFlowInterestsDaily();
        PropertyFlowInterestDaily CheckInsertOrUpdate (PropertyFlowInterestDaily PropertyFlowInterestDaily);
        PropertyFlowInterestDaily RemovePropertyFlowInterestDaily (PropertyFlowInterestDaily PropertyFlowInterestDaily);
        PropertyFlowInterestDaily CheckLast28DaysExistProperty (PropertyFlowInterestDaily PropertyFlowInterestDaily);
        List<PropertyFlowInterestDaily> GetAllPropertyFlowInterestByPropertyDetailIdLast28Days (int PropertyDetailId);
    }
}
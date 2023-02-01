using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class PropertyFlowInterestService : ServiceBase<PropertyFlowInterest>, IPropertyFlowInterestService {
        public PropertyFlowInterestService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<PropertyFlowInterest> GetAllPropertyFlowInterests () {
            return GetAllAsync ().Result.ToList ();
        }

        public List<PropertyFlowInterest> GetAllPropertyFlowInterestByPropertyDetailId (int PropertyDetailId) {
            var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-120);
            //  var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-240);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last2HoursDateTime).Result.ToList ();
        }

        public List<PropertyFlowInterest> GetAllPropertyFlowInterestByPropertyDetailIdLast24Hours (int PropertyDetailId) {
            var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-1440);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last2HoursDateTime).Result.ToList ();
        }

        public PropertyFlowInterest CheckInsertOrUpdate (PropertyFlowInterest PropertyFlowInterest) {
            var existingItem = GetMany (t => t.PropertyDetailId == PropertyFlowInterest.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdatePropertyFlowInterest (existingItem, PropertyFlowInterest);
            } else {
                return InsertPropertyFlowInterest (PropertyFlowInterest);
            }
        }
        public PropertyFlowInterest InsertPropertyFlowInterest (PropertyFlowInterest PropertyFlowInterest) {
            PropertyFlowInterest.CreatedOn = DateTime.Now;
            var newItem = Add (PropertyFlowInterest);
            SaveAsync ();

            return newItem;
        }

        public PropertyFlowInterest CheckLast2HoursExistProperty (PropertyFlowInterest PropertyFlowInterest) {
            var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-120);
            var existItemList = GetMany (t => t.PropertyDetailId == PropertyFlowInterest.PropertyDetailId && t.CreatedOn < last2HoursDateTime).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            PropertyFlowInterest.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterest);
            SaveAsync ();
            return newItem;
        }

        public PropertyFlowInterest CheckPastDayExistProperty (PropertyFlowInterest PropertyFlowInterest) {
            var last24HoursDateTime = DateTime.UtcNow.AddMinutes (-1440);
            var existItemList = GetMany (t => t.PropertyDetailId == PropertyFlowInterest.PropertyDetailId && t.CreatedOn < last24HoursDateTime).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            PropertyFlowInterest.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterest);
            SaveAsync ();
            return newItem;
        }

        public PropertyFlowInterest UpdatePropertyFlowInterest (PropertyFlowInterest existingItem, PropertyFlowInterest PropertyFlowInterest) {
            // existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public PropertyFlowInterest RemovePropertyFlowInterest (PropertyFlowInterest PropertyFlowInterest) {
            Delete (PropertyFlowInterest);
            SaveAsync ();
            return PropertyFlowInterest;
        }

    }

    public partial interface IPropertyFlowInterestService : IService<PropertyFlowInterest> {
        List<PropertyFlowInterest> GetAllPropertyFlowInterests ();
        PropertyFlowInterest CheckInsertOrUpdate (PropertyFlowInterest PropertyFlowInterest);
        PropertyFlowInterest RemovePropertyFlowInterest (PropertyFlowInterest PropertyFlowInterest);
        PropertyFlowInterest CheckLast2HoursExistProperty (PropertyFlowInterest PropertyFlowInterest);
        PropertyFlowInterest CheckPastDayExistProperty (PropertyFlowInterest PropertyFlowInterest);
        List<PropertyFlowInterest> GetAllPropertyFlowInterestByPropertyDetailId (int PropertyDetailId);
        List<PropertyFlowInterest> GetAllPropertyFlowInterestByPropertyDetailIdLast24Hours (int PropertyDetailId);
    }
}
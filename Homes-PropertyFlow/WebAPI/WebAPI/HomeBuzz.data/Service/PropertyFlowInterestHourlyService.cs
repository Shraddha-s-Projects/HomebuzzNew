using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class PropertyFlowInterestHourlyService : ServiceBase<PropertyFlowInterestHourly>, IPropertyFlowInterestHourlyService
    {
        public PropertyFlowInterestHourlyService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<PropertyFlowInterestHourly> GetAllPropertyFlowInterestsHourly() {
            return GetAllAsync ().Result.ToList ();
        }

        public List<PropertyFlowInterestHourly> GetAllPropertyFlowInterestByPropertyDetailId (int PropertyDetailId) {
            var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-120);
            //  var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-240);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last2HoursDateTime).Result.ToList ();
        }

        public List<PropertyFlowInterestHourly> GetAllPropertyFlowInterestByPropertyDetailIdLast24Hours (int PropertyDetailId) {
            var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-1440);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last2HoursDateTime).Result.ToList ();
        }

        public PropertyFlowInterestHourly CheckInsertOrUpdate (PropertyFlowInterestHourly PropertyFlowInterestHourly) {
            var existingItem = GetMany (t => t.PropertyDetailId == PropertyFlowInterestHourly.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdatePropertyFlowInterest (existingItem, PropertyFlowInterestHourly);
            } else {
                return InsertPropertyFlowInterest (PropertyFlowInterestHourly);
            }
        }
        public PropertyFlowInterestHourly InsertPropertyFlowInterest (PropertyFlowInterestHourly PropertyFlowInterest) {
            PropertyFlowInterest.CreatedOn = DateTime.Now;
            var newItem = Add (PropertyFlowInterest);
            SaveAsync ();

            return newItem;
        }

        public PropertyFlowInterestHourly CheckLast2HoursExistProperty (PropertyFlowInterestHourly PropertyFlowInterest) {
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

        public PropertyFlowInterestHourly CheckPastDayExistProperty (PropertyFlowInterestHourly PropertyFlowInterest) {
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

        public PropertyFlowInterestHourly UpdatePropertyFlowInterest (PropertyFlowInterestHourly existingItem, PropertyFlowInterestHourly PropertyFlowInterestHourly) {
            // existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public PropertyFlowInterestHourly RemovePropertyFlowInterestHourly(PropertyFlowInterestHourly propertyFlowInterestHourly) {
            Delete (propertyFlowInterestHourly);
            SaveAsync ();
            return propertyFlowInterestHourly;
        }

    }

    public partial interface IPropertyFlowInterestHourlyService : IService<PropertyFlowInterestHourly> {
        List<PropertyFlowInterestHourly> GetAllPropertyFlowInterestsHourly ();
        PropertyFlowInterestHourly CheckInsertOrUpdate (PropertyFlowInterestHourly PropertyFlowInterest);
        PropertyFlowInterestHourly RemovePropertyFlowInterestHourly (PropertyFlowInterestHourly PropertyFlowInterest);
        PropertyFlowInterestHourly CheckLast2HoursExistProperty (PropertyFlowInterestHourly PropertyFlowInterest);
        PropertyFlowInterestHourly CheckPastDayExistProperty (PropertyFlowInterestHourly PropertyFlowInterest);
        List<PropertyFlowInterestHourly> GetAllPropertyFlowInterestByPropertyDetailId (int PropertyDetailId);
        List<PropertyFlowInterestHourly> GetAllPropertyFlowInterestByPropertyDetailIdLast24Hours (int PropertyDetailId);
    }
}
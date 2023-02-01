using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class PropertyFlowInterestWeeklyService : ServiceBase<PropertyFlowInterestWeekly>, IPropertyFlowInterestWeeklyService
    {
        public PropertyFlowInterestWeeklyService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<PropertyFlowInterestWeekly> GetAllPropertyFlowInterestsWeekly() {
            return GetAllAsync ().Result.ToList ();
        }

        public List<PropertyFlowInterestWeekly> GetAllPropertyFlowInterestWeeklyByPropertyDetailId(int PropertyDetailId) {
            var past28Days = DateTime.UtcNow.AddDays (-28);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= past28Days).Result.ToList ();
        }

        public List<PropertyFlowInterestWeekly> GetAllPropertyFlowInterestWeeklyByPropertyDetailIdLast4Weeks(int PropertyDetailId) {
            var past28Days = DateTime.UtcNow.AddDays (-28);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= past28Days).Result.ToList ();
        }

        public PropertyFlowInterestWeekly CheckInsertOrUpdate (PropertyFlowInterestWeekly PropertyFlowInterestWeekly) {
            var existingItem = GetMany (t => t.PropertyDetailId == PropertyFlowInterestWeekly.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdatePropertyFlowInterestWeekly(existingItem, PropertyFlowInterestWeekly);
            } else {
                return InsertPropertyFlowInterestWeekly(PropertyFlowInterestWeekly);
            }
        }
        public PropertyFlowInterestWeekly InsertPropertyFlowInterestWeekly(PropertyFlowInterestWeekly PropertyFlowInterestWeekly) {
            PropertyFlowInterestWeekly.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterestWeekly);
            SaveAsync ();

            return newItem;
        }

        public PropertyFlowInterestWeekly CheckLast4WeeksExistProperty(PropertyFlowInterestWeekly PropertyFlowInterestWeekly) {
             var past28Days = DateTime.UtcNow.AddDays (-28);
            var existItemList = GetMany (t => t.PropertyDetailId == PropertyFlowInterestWeekly.PropertyDetailId && t.CreatedOn < past28Days).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            PropertyFlowInterestWeekly.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterestWeekly);
            SaveAsync ();
            return newItem;
        }

        public PropertyFlowInterestWeekly CheckPastWeekExistProperty(PropertyFlowInterestWeekly PropertyFlowInterestWeekly) {
            var last4WeeksDateTime = DateTime.UtcNow.AddDays (-28);
            var existItemList = GetMany (t => t.PropertyDetailId == PropertyFlowInterestWeekly.PropertyDetailId && t.CreatedOn < last4WeeksDateTime).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            PropertyFlowInterestWeekly.CreatedOn = DateTime.UtcNow;
            var newItem = Add (PropertyFlowInterestWeekly);
            SaveAsync ();
            return newItem;
        }

        public PropertyFlowInterestWeekly UpdatePropertyFlowInterestWeekly(PropertyFlowInterestWeekly existingItem, PropertyFlowInterestWeekly PropertyFlowInterestWeekly) {
            // existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public PropertyFlowInterestWeekly RemovePropertyFlowInterestWeekly(PropertyFlowInterestWeekly PropertyFlowInterestWeekly) {
            Delete (PropertyFlowInterestWeekly);
            SaveAsync ();
            return PropertyFlowInterestWeekly;
        }

    }

    public partial interface IPropertyFlowInterestWeeklyService : IService<PropertyFlowInterestWeekly> {
        List<PropertyFlowInterestWeekly> GetAllPropertyFlowInterestsWeekly();
        PropertyFlowInterestWeekly CheckInsertOrUpdate (PropertyFlowInterestWeekly PropertyFlowInterest);
        PropertyFlowInterestWeekly RemovePropertyFlowInterestWeekly(PropertyFlowInterestWeekly PropertyFlowInterest);
        PropertyFlowInterestWeekly CheckLast4WeeksExistProperty (PropertyFlowInterestWeekly PropertyFlowInterest);
        PropertyFlowInterestWeekly CheckPastWeekExistProperty (PropertyFlowInterestWeekly PropertyFlowInterest);
        List<PropertyFlowInterestWeekly> GetAllPropertyFlowInterestWeeklyByPropertyDetailId(int PropertyDetailId);
        List<PropertyFlowInterestWeekly> GetAllPropertyFlowInterestWeeklyByPropertyDetailIdLast4Weeks(int PropertyDetailId);
    }
}
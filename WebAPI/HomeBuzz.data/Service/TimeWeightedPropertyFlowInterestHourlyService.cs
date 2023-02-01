using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class TimeWeightedPropertyFlowInterestHourlyService : ServiceBase<TimeWeightedPropertyFlowInterestHourly>, ITimeWeightedPropertyFlowInterestHourlyService {
        public TimeWeightedPropertyFlowInterestHourlyService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<TimeWeightedPropertyFlowInterestHourly> GetAllTimeWeightedPropertyFlowInterestsHourly () {
            return GetAllAsync ().Result.ToList ();
        }

        public List<TimeWeightedPropertyFlowInterestHourly> GetAllTimeWeightedPropertyFlowInterestByPropertyDetailId (int PropertyDetailId) {
            var last2HoursDateTime = DateTime.UtcNow.AddMinutes (-120);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last2HoursDateTime).Result.ToList ();
        }

        public List<TimeWeightedPropertyFlowInterestHourly> GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast24Hours (int PropertyDetailId) {
            var last24HoursDateTime = DateTime.UtcNow.AddMinutes (-1440);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last24HoursDateTime).Result.ToList ();
        }

        public TimeWeightedPropertyFlowInterestHourly CheckInsertOrUpdate (TimeWeightedPropertyFlowInterestHourly TimeWeightedPropertyFlowInterestHourly) {
            var existingItem = GetMany (t => t.PropertyDetailId == TimeWeightedPropertyFlowInterestHourly.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdatePropertyFlowInterest (existingItem, TimeWeightedPropertyFlowInterestHourly);
            } else {
                return InsertPropertyFlowInterest (TimeWeightedPropertyFlowInterestHourly);
            }
        }
        public TimeWeightedPropertyFlowInterestHourly InsertPropertyFlowInterest (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest) {
            PropertyFlowInterest.CreatedOn = DateTime.Now;
            var newItem = Add (PropertyFlowInterest);
            SaveAsync ();

            return newItem;
        }

        public TimeWeightedPropertyFlowInterestHourly CheckLast2HoursExistProperty (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest) {
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

        public TimeWeightedPropertyFlowInterestHourly CheckPastDayExistProperty (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest) {
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

        public TimeWeightedPropertyFlowInterestHourly UpdatePropertyFlowInterest (TimeWeightedPropertyFlowInterestHourly existingItem, TimeWeightedPropertyFlowInterestHourly TimeWeightedPropertyFlowInterestHourly) {
            // existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public TimeWeightedPropertyFlowInterestHourly RemoveTimeWeightedPropertyFlowInterestHourly (TimeWeightedPropertyFlowInterestHourly TimeWeightedPropertyFlowInterestHourly) {
            Delete (TimeWeightedPropertyFlowInterestHourly);
            SaveAsync ();
            return TimeWeightedPropertyFlowInterestHourly;
        }

        public List<TimeWeightedPropertyFlowInterestHourly> GetAllDeActiveTimeWeightedPropertyFlowInterestHourly (List<int> propDetailIds) {

            var propFlowInterests = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propFlowInterests;
        }

    }

    public partial interface ITimeWeightedPropertyFlowInterestHourlyService : IService<TimeWeightedPropertyFlowInterestHourly> {
        List<TimeWeightedPropertyFlowInterestHourly> GetAllTimeWeightedPropertyFlowInterestsHourly ();
        TimeWeightedPropertyFlowInterestHourly CheckInsertOrUpdate (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest);
        TimeWeightedPropertyFlowInterestHourly RemoveTimeWeightedPropertyFlowInterestHourly (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest);
        TimeWeightedPropertyFlowInterestHourly CheckLast2HoursExistProperty (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest);
        TimeWeightedPropertyFlowInterestHourly CheckPastDayExistProperty (TimeWeightedPropertyFlowInterestHourly PropertyFlowInterest);
        List<TimeWeightedPropertyFlowInterestHourly> GetAllTimeWeightedPropertyFlowInterestByPropertyDetailId (int PropertyDetailId);
        List<TimeWeightedPropertyFlowInterestHourly> GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast24Hours (int PropertyDetailId);
        List<TimeWeightedPropertyFlowInterestHourly> GetAllDeActiveTimeWeightedPropertyFlowInterestHourly (List<int> propDetailIds);
    }
}
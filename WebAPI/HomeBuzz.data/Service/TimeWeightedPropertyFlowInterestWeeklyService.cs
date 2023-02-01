using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class TimeWeightedPropertyFlowInterestWeeklyService : ServiceBase<TimeWeightedPropertyFlowInterestWeekly>, ITimeWeightedPropertyFlowInterestWeeklyService {
        public TimeWeightedPropertyFlowInterestWeeklyService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<TimeWeightedPropertyFlowInterestWeekly> GetAllTimeWeightedPropertyFlowInterestsWeekly () {
            return GetAllAsync ().Result.ToList ();
        }

        public List<TimeWeightedPropertyFlowInterestWeekly> GetAllTimeWeightedPropertyFlowInterestWeeklyByPropertyDetailIdLast4Weeks (int PropertyDetailId) {
            var past28Days = DateTime.UtcNow.AddDays (-28);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= past28Days).Result.ToList ();
        }

        public TimeWeightedPropertyFlowInterestWeekly CheckInsertOrUpdate (TimeWeightedPropertyFlowInterestWeekly TimeWeightedPropertyFlowInterestWeekly) {
            var existingItem = GetMany (t => t.PropertyDetailId == TimeWeightedPropertyFlowInterestWeekly.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdateTimeWeightedPropertyFlowInterestWeekly (existingItem, TimeWeightedPropertyFlowInterestWeekly);
            } else {
                return InsertTimeWeightedPropertyFlowInterestWeekly (TimeWeightedPropertyFlowInterestWeekly);
            }
        }
        public TimeWeightedPropertyFlowInterestWeekly InsertTimeWeightedPropertyFlowInterestWeekly (TimeWeightedPropertyFlowInterestWeekly TimeWeightedPropertyFlowInterestWeekly) {
            TimeWeightedPropertyFlowInterestWeekly.CreatedOn = DateTime.UtcNow;
            var newItem = Add (TimeWeightedPropertyFlowInterestWeekly);
            SaveAsync ();

            return newItem;
        }
        public TimeWeightedPropertyFlowInterestWeekly UpdateTimeWeightedPropertyFlowInterestWeekly (TimeWeightedPropertyFlowInterestWeekly existingItem, TimeWeightedPropertyFlowInterestWeekly TimeWeightedPropertyFlowInterestWeekly) {
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }
        public TimeWeightedPropertyFlowInterestWeekly RemoveTimeWeightedPropertyFlowInterestWeekly (TimeWeightedPropertyFlowInterestWeekly TimeWeightedPropertyFlowInterestWeekly) {
            Delete (TimeWeightedPropertyFlowInterestWeekly);
            SaveAsync ();
            return TimeWeightedPropertyFlowInterestWeekly;
        }

        public List<TimeWeightedPropertyFlowInterestWeekly> GetAllDeActiveTimeWeightedPropertyFlowInterestWeekly (List<int> propDetailIds) {

            var propFlowInterests = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propFlowInterests;
        }
        public TimeWeightedPropertyFlowInterestWeekly CheckPast4WeeksExistProperty (TimeWeightedPropertyFlowInterestWeekly TimeWeightedPropertyFlowInterestWeekly) {
            var past28Days = DateTime.UtcNow.AddDays (-28);
            var existItemList = GetMany (t => t.PropertyDetailId == TimeWeightedPropertyFlowInterestWeekly.PropertyDetailId && t.CreatedOn < past28Days).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            TimeWeightedPropertyFlowInterestWeekly.CreatedOn = DateTime.UtcNow;
            var newItem = Add (TimeWeightedPropertyFlowInterestWeekly);
            SaveAsync ();
            return newItem;
        }

    }

    public partial interface ITimeWeightedPropertyFlowInterestWeeklyService : IService<TimeWeightedPropertyFlowInterestWeekly> {
        List<TimeWeightedPropertyFlowInterestWeekly> GetAllTimeWeightedPropertyFlowInterestsWeekly ();
        TimeWeightedPropertyFlowInterestWeekly CheckInsertOrUpdate (TimeWeightedPropertyFlowInterestWeekly PropertyFlowInterest);
        TimeWeightedPropertyFlowInterestWeekly RemoveTimeWeightedPropertyFlowInterestWeekly (TimeWeightedPropertyFlowInterestWeekly PropertyFlowInterest);
        List<TimeWeightedPropertyFlowInterestWeekly> GetAllTimeWeightedPropertyFlowInterestWeeklyByPropertyDetailIdLast4Weeks (int PropertyDetailId);
        List<TimeWeightedPropertyFlowInterestWeekly> GetAllDeActiveTimeWeightedPropertyFlowInterestWeekly (List<int> propDetailIds);
        TimeWeightedPropertyFlowInterestWeekly CheckPast4WeeksExistProperty (TimeWeightedPropertyFlowInterestWeekly PropertyFlowInterest);
    }
}
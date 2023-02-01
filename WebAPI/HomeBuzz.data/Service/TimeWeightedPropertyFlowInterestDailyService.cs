using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class TimeWeightedPropertyFlowInterestDailyService : ServiceBase<TimeWeightedPropertyFlowInterestDaily>, ITimeWeightedPropertyFlowInterestDailyService {
        public TimeWeightedPropertyFlowInterestDailyService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }

        public List<TimeWeightedPropertyFlowInterestDaily> GetAllTimeWeightedPropertyFlowInterestsDaily () {
            return GetAllAsync ().Result.ToList ();
        }
        public List<TimeWeightedPropertyFlowInterestDaily> GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast28Days (int PropertyDetailId) {
            var last28Days = DateTime.UtcNow.AddDays (-28);
            return GetMany (t => t.PropertyDetailId == PropertyDetailId && t.CreatedOn >= last28Days).Result.ToList ();
        }
        public TimeWeightedPropertyFlowInterestDaily CheckInsertOrUpdate (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily) {
            var existingItem = GetMany (t => t.PropertyDetailId == TimeWeightedPropertyFlowInterestDaily.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdateTimeWeightedPropertyFlowInterestDaily (existingItem, TimeWeightedPropertyFlowInterestDaily);
            } else {
                return InsertTimeWeightedPropertyFlowInterestDaily (TimeWeightedPropertyFlowInterestDaily);
            }
        }
        public TimeWeightedPropertyFlowInterestDaily InsertTimeWeightedPropertyFlowInterestDaily (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily) {
            TimeWeightedPropertyFlowInterestDaily.CreatedOn = DateTime.UtcNow;
            var newItem = Add (TimeWeightedPropertyFlowInterestDaily);
            SaveAsync ();

            return newItem;
        }
        public TimeWeightedPropertyFlowInterestDaily UpdateTimeWeightedPropertyFlowInterestDaily (TimeWeightedPropertyFlowInterestDaily existingItem, TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily) {
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }
        public TimeWeightedPropertyFlowInterestDaily RemoveTimeWeightedPropertyFlowInterestDaily (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily) {
            Delete (TimeWeightedPropertyFlowInterestDaily);
            SaveAsync ();
            return TimeWeightedPropertyFlowInterestDaily;
        }
        public TimeWeightedPropertyFlowInterestDaily CheckLast28DaysExistProperty (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily) {
            var past28Days = DateTime.UtcNow.AddDays (-28);
            var existItemList = GetMany (t => t.PropertyDetailId == TimeWeightedPropertyFlowInterestDaily.PropertyDetailId && t.CreatedOn < past28Days).Result.ToList ();
            foreach (var item in existItemList) {
                Delete (item);
            }

            TimeWeightedPropertyFlowInterestDaily.CreatedOn = DateTime.UtcNow;
            var newItem = Add (TimeWeightedPropertyFlowInterestDaily);
            SaveAsync ();
            return newItem;
        }
        public List<TimeWeightedPropertyFlowInterestDaily> GetAllDeActiveTimeWeightedPropertyFlowInterestDaily (List<int> propDetailIds) {

            var propFlowInterests = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propFlowInterests;
        }
    }

    public partial interface ITimeWeightedPropertyFlowInterestDailyService : IService<TimeWeightedPropertyFlowInterestDaily> {
        List<TimeWeightedPropertyFlowInterestDaily> GetAllTimeWeightedPropertyFlowInterestsDaily ();
        TimeWeightedPropertyFlowInterestDaily CheckInsertOrUpdate (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily);
        TimeWeightedPropertyFlowInterestDaily RemoveTimeWeightedPropertyFlowInterestDaily (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily);
        TimeWeightedPropertyFlowInterestDaily CheckLast28DaysExistProperty (TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDaily);
        List<TimeWeightedPropertyFlowInterestDaily> GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast28Days (int PropertyDetailId);
        List<TimeWeightedPropertyFlowInterestDaily> GetAllDeActiveTimeWeightedPropertyFlowInterestDaily (List<int> propDetailIds);
    }
}
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data {
    public partial class PropertyNotifyService : ServiceBase<PropertyNotify>, IPropertyNotifyService {
        private readonly IPropertyRepository _propertyRepository;
        public PropertyNotifyService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public PropertyNotifyVM CheckInsertOrUpdate (PropertyNotifyVM notify) {
            var existingItem = GetMany (t => t.PropertyDetailId == notify.PropertyDetailId && t.UserId == notify.UserId).Result.FirstOrDefault ();

            if (existingItem != null) {
                notify.IsUserAlreadyExist = true;
                notify.Id = existingItem.Id;
                return notify;
            } else {
                PropertyNotify model = new PropertyNotify ();
                model.PropertyDetailId = notify.PropertyDetailId;
                model.UserId = notify.UserId;
                var data = InsertNotify (model);
                notify.Id = data.Id;
                return notify;
            }
        }

        public PropertyNotify InsertNotify (PropertyNotify notify) {
            var newItem = Add (notify);
            SaveAsync ();

            return newItem;
        }
        public PropertyNotify UpdateNotify (PropertyNotify existingItem, PropertyNotify notify) {

            UpdateAsync (existingItem, notify.Id);
            SaveAsync ();

            return existingItem;
        }

        public List<PropertyNotify> GetAllDeActivePropertyNotify (List<int> propDetailIds) {

            var propNotify = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propNotify;
        }

        public PropertyNotify RemovePropertyNotify (PropertyNotify propertyNotify) {
            Delete (propertyNotify);
            SaveAsync ();
            return propertyNotify;
        }

          public List<PropertyNotify> GetAllPropertyNotifyByDetailId (int propDetailId) {

            var propNotifyList = GetAllAsync ().Result.Where(t => t.PropertyDetailId == propDetailId).ToList ();

            return propNotifyList;
        }
    }

    public partial interface IPropertyNotifyService : IService<PropertyNotify> {
        PropertyNotifyVM CheckInsertOrUpdate (PropertyNotifyVM notify);
        List<PropertyNotify> GetAllDeActivePropertyNotify (List<int> propDetailIds);
        PropertyNotify RemovePropertyNotify (PropertyNotify propertyNotify);
        List<PropertyNotify> GetAllPropertyNotifyByDetailId (int propDetailId);
    }
}
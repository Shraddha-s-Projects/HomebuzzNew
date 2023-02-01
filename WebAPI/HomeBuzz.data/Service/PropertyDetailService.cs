using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data {
	public partial class PropertyDetailService : ServiceBase<PropertyDetail>, IPropertyDetailService {
		private readonly IPropertyRepository _propertyRepository;
		public PropertyDetailService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
			_propertyRepository = propertyRepository;
		}

		public PropertyDetail CheckInsertOrUpdate (PropertyDetail property, bool IsAddViewCount) {
			//var existingItem = GetMany (t => t.Id == property.Id).Result.FirstOrDefault ();
			if (property.Status == "Pre-market") {
				// property.StatusId = 2;
			}
			// if (property.Status == "Open home / Owner active") {
			// 	property.StatusId = 3;
			// }
			if (property.Status == "For sale") {
				// property.StatusId = 4;
			}
			var existingItem = GetMany (t => t.Id == property.Id).Result.FirstOrDefault ();
			//property exist
			if (existingItem != null) {
				if (IsAddViewCount == true) {
					existingItem.ViewCount = existingItem.ViewCount + 1;
				} else {
					property.ViewCount = existingItem.ViewCount;
				}
				return UpdateProperty (existingItem, property);
			}
			//Add new
			else {
				if (IsAddViewCount == true) {
					property.ViewCount = property.ViewCount + 1;
				}
				return InsertProperty (property);
			}
		}
		public PropertyDetail InsertProperty (PropertyDetail property) {
			// property.ViewCount = 1; // default set as 1
			var newItem = Add (property);
			SaveAsync ();

			return newItem;
		}
		public PropertyDetail UpdateProperty (PropertyDetail existingItem, PropertyDetail property) {
			//   existingItem.ViewCount = existingItem.ViewCount + 1; //increase view count
			existingItem.ViewedDate = DateTime.UtcNow;
			UpdateAsync (existingItem, property.Id);
			SaveAsync ();

			return existingItem;
		}
		public List<PropertyDetail> GetAllProperty () {
			return GetAllAsync ().Result.ToList ();
		}

		public List<PropertyDetail> GetAllPropertyDetails (List<int> propDataIds) {
			var propDetails = GetAllAsync ().Result.Join (propDataIds, sc => sc.PropertyId, pli => pli, (sc, pli) => sc).ToList ();

			return propDetails;
		}

		public List<PropertyDetail> GetAllPropertyDetailsInTimePeriod (List<int> propDetailIds, int From, int To) {
			DateTime fromPeriod = DateTime.Now.AddDays (-From);
			DateTime toPeriod = DateTime.Now.AddDays (-To);
			var propDetails = GetAllAsync ().Result.Where (p => p.ActivatedDate <= fromPeriod && p.ActivatedDate >= toPeriod).Join (propDetailIds, sc => sc.Id, pli => pli, (sc, pli) => sc).ToList ();

			return propDetails;
		}

		public List<PropertyDetail> GetAllPropertyDetailsByPropertyDataInTimePeriod (List<int> propDataIds, int From, int To) {
			DateTime fromPeriod = DateTime.Now.AddDays (-From);
			DateTime toPeriod = DateTime.Now.AddDays (-To);
			var propDetails = GetAllAsync ().Result.Where (p => p.ActivatedDate <= fromPeriod && p.ActivatedDate >= toPeriod).Join (propDataIds, sc => sc.PropertyId, pli => pli, (sc, pli) => sc).ToList ();

			return propDetails;
		}

		public List<PropertyDetail> GetAllClaimedPropertyDetailByUser (int userId) {
			var propDetails = GetAllAsync ().Result.Where (p => p.OwnerId == userId && p.IsClaimed == true).ToList ();

			return propDetails;
		}

		public PropertyDetail GetPropertyDetailById (int Id) {
			return GetMany (x => x.Id == Id).Result.FirstOrDefault ();
		}

		public PropertyDetail GetPropertyByPropertyId (int propertyId) {
			return GetMany (x => x.PropertyId.Value == propertyId).Result.FirstOrDefault ();
		}

		public List<PropertyDetail> GetAllDeActivateProperty (int day) {
			DateTime dayPeriod = DateTime.Now.AddDays (-day);
			var propDetails = GetAllAsync ().Result.Where (p => p.ActivatedDate <= dayPeriod).ToList ();
			return propDetails;
		}

		public List<PropertyDetail> GetAllNotifyProperty (int day) {

			DateTime dayPeriod = DateTime.Now.AddDays (-day);
			var propDetails = GetAllAsync ().Result.Where (p => p.OpenedDate != null && p.OpenedDate.Value.ToShortDateString () == dayPeriod.ToShortDateString ()).ToList ();
			return propDetails;
		}

		public PropertyDetail RemovePropertyDetail (PropertyDetail propertyDetail) {
			Delete (propertyDetail);
			SaveAsync ();
			return propertyDetail;
		}

		public Property GetPropertyDetail (int PropertyDetailId, int? UserId) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@PropertyDetailId", Value = PropertyDetailId },
				new SqlParameter { ParameterName = "@userId", Value = UserId }
			};

			return _propertyRepository.ExecuteSP<Property> ("GETPROPERTYDETAIL", parameters).FirstOrDefault ();
		}
	}

	public partial interface IPropertyDetailService : IService<PropertyDetail> {
		PropertyDetail CheckInsertOrUpdate (PropertyDetail property, bool IsAddViewCount);

		List<PropertyDetail> GetAllProperty ();

		List<PropertyDetail> GetAllPropertyDetails (List<int> propDataIds);

		List<PropertyDetail> GetAllPropertyDetailsInTimePeriod (List<int> propDetailIds, int From, int To);

		List<PropertyDetail> GetAllPropertyDetailsByPropertyDataInTimePeriod (List<int> propDataIds, int From, int To);

		PropertyDetail GetPropertyDetailById (int Id);

		PropertyDetail GetPropertyByPropertyId (int propertyId);

		List<PropertyDetail> GetAllDeActivateProperty (int day);

		PropertyDetail RemovePropertyDetail (PropertyDetail propertyDetail);

		Property GetPropertyDetail (int PropertyDetailId, int? UserId);

		List<PropertyDetail> GetAllNotifyProperty (int day);
	}
}
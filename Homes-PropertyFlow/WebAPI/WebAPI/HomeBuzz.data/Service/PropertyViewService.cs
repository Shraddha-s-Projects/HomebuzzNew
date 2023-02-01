using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace HomeBuzz.data.Service {
	public partial class PropertyViewService : ServiceBase<PropertyView>, IPropertyViewService {
		private readonly IPropertyRepository _propertyRepository;
		public PropertyViewService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
			_propertyRepository = propertyRepository;
		}
		public PropertyView CheckInsertOrUpdate (PropertyViewVM propertyViewVM) {
			var result = new PropertyView ();
			foreach (var PropertyDetailId in propertyViewVM.PropertyDetailId) {
				PropertyView propertyView = new PropertyView ();
				var today = DateTime.Today;
				// var existingItem = GetMany (t => t.UserId == propertyViewVM.UserId && t.PropertyDetailId == Convert.ToInt32 (PropertyDetailId)).Result.FirstOrDefault ();
				var existingItem = new PropertyView ();
				// = GetMany (t => t.UserId == propertyViewVM.UserId && t.PropertyDetailId == Convert.ToInt32 (PropertyDetailId) && t.ViewDate == today).Result.FirstOrDefault ();
				propertyView.Id = propertyViewVM.Id;
				if (propertyViewVM.UserId != null) {
					existingItem = GetMany (t => t.UserKey == propertyViewVM.UserKey && t.PropertyDetailId == Convert.ToInt32 (PropertyDetailId) && t.ViewDate == today).Result.FirstOrDefault ();
					propertyView.UserId = Convert.ToInt16 (propertyViewVM.UserId);
				} else {
					existingItem = GetMany (t => t.UserKey == propertyViewVM.UserKey && t.PropertyDetailId == Convert.ToInt32 (PropertyDetailId) && t.ViewDate == today).Result.FirstOrDefault ();
				}
				propertyView.PropertyDetailId = Convert.ToInt32 (PropertyDetailId);
				propertyView.ViewDate = propertyViewVM.ViewDate;
				propertyView.UserKey = propertyViewVM.UserKey;
				// result = InsertPropertyView (propertyView);
				if (existingItem != null) {
					result = UpdatePropertyView (existingItem, propertyView);
				} else {
					result = InsertPropertyView (propertyView);
				}
			}

			return result;
		}

		public List<PropertyView> CheckInsertOrUpdatePropertyView (List<PropertyViewListVM> propertyViewVMList) {
			var resultList = new List<PropertyView> ();
			PropertyView result = new PropertyView ();
			foreach (var propertyViewVM in propertyViewVMList) {
				PropertyView propertyView = new PropertyView ();
				var existingItem = new PropertyView ();
				if (propertyViewVM.UserId != null) {
					existingItem = GetMany (t => t.UserKey == propertyViewVM.UserKey && t.PropertyDetailId == Convert.ToInt32 (propertyViewVM.PropertyDetailId) && t.ViewDate.ToString ("d/MM/yyyy") == propertyViewVM.ViewDate.ToString ("d/MM/yyyy")).Result.FirstOrDefault ();
				} else {
					existingItem = GetMany (t => t.UserKey == propertyViewVM.UserKey && t.PropertyDetailId == Convert.ToInt32 (propertyViewVM.PropertyDetailId) && t.ViewDate.ToString ("d/MM/yyyy") == propertyViewVM.ViewDate.ToString ("d/MM/yyyy")).Result.FirstOrDefault ();
				}
				// var existingItem = GetMany (t => t.UserId == propertyViewVM.UserId && t.PropertyDetailId == Convert.ToInt32 (propertyViewVM.PropertyDetailId)).Result.FirstOrDefault ();
				propertyView.Id = propertyViewVM.Id;
				propertyView.UserId = propertyViewVM.UserId.Value;
				propertyView.PropertyDetailId = Convert.ToInt32 (propertyViewVM.PropertyDetailId);
				propertyView.UserKey = propertyViewVM.UserKey;
				propertyView.ViewDate = propertyViewVM.ViewDate;
				if (existingItem != null) {
					existingItem.UserId = Convert.ToInt16 (propertyViewVM.UserId);
					result = UpdatePropertyView (existingItem, propertyView);
					resultList.Add (result);
				} else {
					result = InsertPropertyView (propertyView);
					resultList.Add (result);
				}
			}

			return resultList;
		}

		public List<PropertyView> GetPropertyViewByUserId (long UserId) {
			List<PropertyView> propertyViews = new List<PropertyView> ();
			propertyViews = GetMany (t => t.UserId == UserId).Result.ToList ();
			return propertyViews;
		}

		public List<PropertyView> GetPropertyViewByUserKey (string UserKey) {
			List<PropertyView> propertyViews = new List<PropertyView> ();
			propertyViews = GetMany (t => t.UserKey == UserKey).Result.ToList ();
			return propertyViews;
		}

		public PropertyView InsertPropertyView (PropertyView state) {
			// state.ViewDate = DateTime.Now;
			state.ViewDate = DateTime.UtcNow;
			var newItem = Add (state);
			SaveAsync ();

			return newItem;
		}

		public PropertyView UpdatePropertyView (PropertyView existingItem, PropertyView propertyView) {
			UpdateAsync (existingItem, existingItem.Id);
			SaveAsync ();

			return existingItem;
		}

		public List<PropertyView> GetAllPropertyViewsInTimePeriod (List<int> propDetailIds, int From, int To) {
			DateTime fromPeriod = DateTime.Now.AddDays (-From);
			DateTime toPeriod = DateTime.Now.AddDays (-To);
			var propDetails = GetAllAsync ().Result.Where (p => p.ViewDate <= fromPeriod && p.ViewDate >= toPeriod).Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();
			return propDetails;
		}

		public List<PropertyView> GetAllDeActivePropertyView (List<int> propDetailIds) {

			var propViews = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

			return propViews;
		}

		public List<Property> GetAllPropertiesViews (SearchVM searchVM) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@bedrooms", Value = searchVM.Bedrooms },
				new SqlParameter { ParameterName = "@bathrooms", Value = searchVM.Bathrooms },
				new SqlParameter { ParameterName = "@status", Value = searchVM.Status },
				new SqlParameter { ParameterName = "@from", Value = searchVM.From },
				new SqlParameter { ParameterName = "@to", Value = searchVM.To },
				new SqlParameter { ParameterName = "@userId", Value = searchVM.UserId },
				new SqlParameter { ParameterName = "@PageNum", Value = searchVM.PageNum.Value },
				new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
				new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
				new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
				new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng }
			};

			return _propertyRepository.ExecuteSP<Property> ("GETPROPERTIESVIEWCOUNT", parameters).ToList ();
		}

		public PropertyView RemovePropertyView (PropertyView propertyView) {
			Delete (propertyView);
			SaveAsync ();
			return propertyView;
		}

		public List<PropertyView> GetPropertyViewBasedOnDetailIdUserId (SearchPropertyViewModel Model) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@userId", Value = Model.UserId },
				new SqlParameter { ParameterName = "@userKey", Value = Model.UserKey },
				new SqlParameter { ParameterName = "@PropertyDetailIds", Value = Model.PropertydetailIds }
			};

			var data = _propertyRepository.ExecuteSP<PropertyView> ("GETPROPERTYVIEWBYDETAILIDS", parameters).ToList ();
			return data;
		}
	}

	public partial interface IPropertyViewService : IService<PropertyView> {
		PropertyView CheckInsertOrUpdate (PropertyViewVM propertyView);

		List<PropertyView> GetPropertyViewByUserId (long UserId);
		List<PropertyView> GetPropertyViewByUserKey (string UserKey);

		List<PropertyView> GetAllPropertyViewsInTimePeriod (List<int> propDetailIds, int From, int To);

		List<Property> GetAllPropertiesViews (SearchVM searchVM);

		List<PropertyView> GetAllDeActivePropertyView (List<int> propDetailIds);

		PropertyView RemovePropertyView (PropertyView propertyView);

		List<PropertyView> CheckInsertOrUpdatePropertyView (List<PropertyViewListVM> propertyViewVMList);
		List<PropertyView> GetPropertyViewBasedOnDetailIdUserId (SearchPropertyViewModel Model);
	}
}
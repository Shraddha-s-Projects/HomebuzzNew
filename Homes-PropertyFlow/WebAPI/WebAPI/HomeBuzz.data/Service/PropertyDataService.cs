using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data {
	public partial class PropertyDataService : ServiceBase<PropertyData>, IPropertyDataService {
		private readonly IPropertyRepository _propertyRepository;
		public PropertyDataService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
			_propertyRepository = propertyRepository;
		}

		public List<PropertyData> GetAllPropertyData (string searchTerm) {
			var searchedPropeties = new List<PropertyData> ();
			if (searchTerm != null) {
				//take first 100
				//	var count = searchTerm.Split (",").Length;
				// if (count >= 3) {
				// 	searchedPropeties = GetMany (p => p.Address.ToLower () == searchTerm.ToLower ()).Result.Take (100).ToList ();
				// } else {
				searchedPropeties = GetMany (p => p.Address.Contains (searchTerm)).Result.Take (100).ToList ();

				//	var data = GetMany (p => p.Address.IndexOf (searchTerm));
				//	}
				return searchedPropeties;
			} else {
				return searchedPropeties;
			}
		}

		public List<Property> GetAllProperties (SearchVM searchVM) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@from", Value = searchVM.From },
				new SqlParameter { ParameterName = "@to", Value = searchVM.To },
				new SqlParameter { ParameterName = "@userId", Value = searchVM.UserId },
				new SqlParameter { ParameterName = "@PageNum", Value = searchVM.PageNum.Value },
				new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
				new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
				new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
				new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng }
			};

			return _propertyRepository.ExecuteSP<Property> ("GETPROPERTIES", parameters).ToList ();
		}

		public SubHurbPropertyInfo GetSubHurbPropertyInfo (SearchVM searchVM) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@SearchTerm", Value = searchVM.SearchTerm }
			};

			return _propertyRepository.ExecuteSP<SubHurbPropertyInfo> ("GETSubHurbPropertyInfo", parameters).FirstOrDefault ();
		}

		public List<Property> GetAllMasterProperties (string searchTerm) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@searchTerm", Value = searchTerm },
				new SqlParameter { ParameterName = "@addressType", Value = "street_address" }
			};

			return _propertyRepository.ExecuteSP<Property> ("GETMASTERPROPERTYDATA", parameters).ToList ();
		}

		public PropertyData GetPropertyDataById (int Id) {
			var existingItem = GetMany (t => t.Id == Id).Result.FirstOrDefault ();
			return existingItem;
		}

		public List<AdminPropertyVM> GetAdminProperties (AdminPropertyVM Model) {
			SqlParameter[] parameters = {
				new SqlParameter { ParameterName = "@PageNum", Value = Model.PageNum },
				new SqlParameter { ParameterName = "@PageSize", Value = Model.PageSize },
				new SqlParameter { ParameterName = "@OrderColumnName", Value = Model.OrderColumnName },
				new SqlParameter { ParameterName = "@OrderColumnDir", Value = Model.OrderColumnDir },
				new SqlParameter { ParameterName = "@Address", Value = Model.Address },
				new SqlParameter { ParameterName = "@Suburb", Value = Model.Suburb },
				new SqlParameter { ParameterName = "@City", Value = Model.City },
				new SqlParameter { ParameterName = "@Bedrooms", Value = Model.Bedrooms },
				new SqlParameter { ParameterName = "@Bathrooms", Value = Model.Bathrooms },
				new SqlParameter { ParameterName = "@CarSpace", Value = Model.CarSpace },
				new SqlParameter { ParameterName = "@Landarea", Value = Model.Landarea },
				new SqlParameter { ParameterName = "@IsActive", Value = Model.IsActive }
			};

			var data = _propertyRepository.ExecuteSP<AdminPropertyVM> ("GETPROPERTIESFORADMIN", parameters).ToList ();
			return data;
		}

		public PropertyData CheckAndUpdateInActivePropertyForAdmin (PropertyData property) {
			var existingItem = GetMany (t => t.Id == property.Id).Result.FirstOrDefault ();
			if (existingItem != null) {
				return UpdateInActivePropertyForAdmin (existingItem, property);
			}
			return null;
		}

		public PropertyData UpdateInActivePropertyForAdmin (PropertyData existingItem, PropertyData property) {
			existingItem.Address = property.Address;
			existingItem.Suburb = property.Suburb;
			existingItem.City = property.City;
			existingItem.HomebuzzEstimate = property.HomebuzzEstimate;
			existingItem.Bedrooms = property.Bedrooms;
			existingItem.Bathrooms = property.Bathrooms;
			existingItem.CarSpace = property.CarSpace;
			existingItem.Landarea = property.Landarea;
			existingItem.Latitude = property.Latitude;
			existingItem.Longitude = property.Longitude;
			existingItem.LatitudeLongitude = property.Latitude + ", " + property.Longitude;

			UpdateAsync (existingItem, existingItem.Id);
			SaveAsync ();

			return existingItem;
		}

		public PropertyData RemoveInActiveProperty (PropertyData existingItem) {
			Delete (existingItem);
			SaveAsync ();
			return existingItem;
		}
	}

	public partial interface IPropertyDataService : IService<PropertyData> {
		List<PropertyData> GetAllPropertyData (string searchTerm);
		List<Property> GetAllProperties (SearchVM searchVM);
		List<Property> GetAllMasterProperties (string searchTerm);
		PropertyData GetPropertyDataById (int Id);
		SubHurbPropertyInfo GetSubHurbPropertyInfo (SearchVM searchVM);
		List<AdminPropertyVM> GetAdminProperties (AdminPropertyVM Model);
		PropertyData CheckAndUpdateInActivePropertyForAdmin (PropertyData property);
		PropertyData RemoveInActiveProperty (PropertyData existingItem);
	}
}
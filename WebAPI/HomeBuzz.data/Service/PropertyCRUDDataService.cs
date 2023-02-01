using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace HomeBuzz.data {
    public partial class PropertyCrudDataService : ServiceBase<PropertyCrudData>, IPropertyCrudDataService {
        private readonly IPropertyRepository _propertyRepository;
        public PropertyCrudDataService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public List<PropertyCrudData> GetAllPropertyCrudData (string searchTerm) {
            var searchedPropeties = new List<PropertyCrudData> ();
            if (searchTerm != null) {
                var count = searchTerm.Split (",").Length;
                if (count >= 3) {
                    searchedPropeties = GetMany (p => p.Address.ToLower () == searchTerm.ToLower ()).Result.Take (100).ToList ();
                } else {
                    searchedPropeties = GetMany (p => p.Address.Contains (searchTerm)).Result.Take (100).ToList ();
                }
                return searchedPropeties;
            } else {
                return searchedPropeties;
            }
        }

        public List<Property> GetAllProperties (SearchVM searchVM) {
            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@searchText", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To },
                new SqlParameter { ParameterName = "@userId", Value = searchVM.UserId },
                new SqlParameter { ParameterName = "@PageNum", Value = searchVM.PageNum.Value },
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@addressType", Value = searchVM.AddressType },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@Status", Value = searchVM.Status },
                new SqlParameter { ParameterName = "@IsExactMatchBed", Value = searchVM.IsExactMatchBed },
                new SqlParameter { ParameterName = "@IsExactMatchBath", Value = searchVM.IsExactMatchBath },
                new SqlParameter { ParameterName = "@MinPrice", Value = searchVM.MinPrice },
                new SqlParameter { ParameterName = "@MaxPrice", Value = searchVM.MaxPrice },
                new SqlParameter { ParameterName = "@IsSurroundingSuburb", Value = searchVM.IsSurroundingSuburb },
            };

            return _propertyRepository.ExecuteSP<Property> ("GETPROPERTIES", parameters).ToList ();
        }

        public List<ViewCountVM> GetActiveInActiveViewCount (SearchVM searchVM) {
            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@searchText", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@PropertyId", Value = searchVM.PropertyId.Value }
            };

            var data = _propertyRepository.ExecuteSP<ViewCountVM> ("GETSIMILARPROPERTYCOUNT", parameters).ToList ();
            return data;
        }

        public List<Property> GetSubHurbSimilarProperties (SearchVM searchVM) {
            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@searchText", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To },
                new SqlParameter { ParameterName = "@userId", Value = searchVM.UserId },
                new SqlParameter { ParameterName = "@PropertyId", Value = searchVM.PropertyId },
                new SqlParameter { ParameterName = "@PageNum", Value = searchVM.PageNum.Value },
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@Status", Value = searchVM.Status }
            };

            return _propertyRepository.ExecuteSP<Property> ("GETSUBHURBPROPERTIESFORMAP", parameters).ToList ();
        }

        public PropertyCrudData CheckInsertOrUpdate (PropertyCrudData property) {
            //	var existingItem = GetMany (t => t.PropertyDetailId == property.PropertyDetailId).Result.FirstOrDefault ();
            var existingItem = GetMany (t => t.Id == property.Id).Result.FirstOrDefault ();

            //property exist
            if (existingItem != null) {
                return UpdatePropertyCrud (existingItem, property);
            }
            //Add new
            else {
                return InsertPropertyCrud (property);
            }
        }

        public PropertyCrudData InsertPropertyCrud (PropertyCrudData property) {
            var newItem = Add (property);
            SaveAsync ();

            return newItem;
        }
        public PropertyCrudData UpdatePropertyCrud (PropertyCrudData existingItem, PropertyCrudData property) {
            UpdateAsync (existingItem, property.Id);
            SaveAsync ();
            return existingItem;
        }

        public PropertyCrudData GetPropertyCrudDataByPropertyDetailId (int propertyDetailId) {
            return GetMany (x => x.PropertyDetailId.Value == propertyDetailId).Result.FirstOrDefault ();
        }

        public List<PropertyCrudData> GetAllPropertyCrudDataInTimePeriod (List<int> propDetailIds) {

            var propDetails = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propDetails;
        }

        public PropertyCrudData RemovePropertyCrudData (PropertyCrudData propertyCrudData) {
            Delete (propertyCrudData);
            SaveAsync ();
            return propertyCrudData;
        }

        public List<PropertyView> GetPropertyViewBasedOnDetailId (SearchPropertyViewModel Model) {
            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@userId", Value = Model.UserId },
                new SqlParameter { ParameterName = "@userKey", Value = Model.UserKey },
                new SqlParameter { ParameterName = "@PropertyDetailIds", Value = Model.PropertydetailIds }
            };

            var data = _propertyRepository.ExecuteSP<PropertyView> ("GETPROPERTYVIEW", parameters).ToList ();
            return data;
        }

        //Bhavesh Ladva
        public List<RankedPropertyVM> GetBuzzProperty (SearchVM searchVM) {

            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@Suburb", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@Status", Value = searchVM.Status },
                new SqlParameter { ParameterName = "@IsExactMatchBed", Value = searchVM.IsExactMatchBed },
                new SqlParameter { ParameterName = "@IsExactMatchBath", Value = searchVM.IsExactMatchBath },
                new SqlParameter { ParameterName = "@MinPrice", Value = searchVM.MinPrice },
                new SqlParameter { ParameterName = "@MaxPrice", Value = searchVM.MaxPrice }
            };

            var data = _propertyRepository.ExecuteSP<RankedPropertyVM> ("GETMAXVIEWEDPROPERTIESBYAREA", parameters).ToList ();
            return data;
        }

        public List<RankedPropertyVM> GetRankedProperties (SearchVM searchVM) {

            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@Suburb", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@Status", Value = searchVM.Status },
                new SqlParameter { ParameterName = "@IsExactMatchBed", Value = searchVM.IsExactMatchBed },
                new SqlParameter { ParameterName = "@IsExactMatchBath", Value = searchVM.IsExactMatchBath },
                new SqlParameter { ParameterName = "@MinPrice", Value = searchVM.MinPrice },
                new SqlParameter { ParameterName = "@MaxPrice", Value = searchVM.MaxPrice },
                new SqlParameter { ParameterName = "@IsSurroundingSuburb", Value = searchVM.IsSurroundingSuburb }
            };

            var data = _propertyRepository.ExecuteSP<RankedPropertyVM> ("GETRANKEDPROPERTIES", parameters).ToList ();
            return data;
        }

        public List<Property> GetLast90View (SearchVM searchVM) {

            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@Suburb", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@Status", Value = searchVM.Status },
                new SqlParameter { ParameterName = "@IsExactMatchBed", Value = searchVM.IsExactMatchBed },
                new SqlParameter { ParameterName = "@IsExactMatchBath", Value = searchVM.IsExactMatchBath },
                new SqlParameter { ParameterName = "@MinPrice", Value = searchVM.MinPrice },
                new SqlParameter { ParameterName = "@MaxPrice", Value = searchVM.MaxPrice },
                new SqlParameter { ParameterName = "@IsSurroundingSuburb", Value = searchVM.IsSurroundingSuburb }
            };

            var data = _propertyRepository.ExecuteSP<Property> ("GETLAST90VIEWS", parameters).ToList ();
            return data;
        }

         public List<Property> GetTimeWeightedLast90View (SearchVM searchVM) {

            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To }
            };

            var data = _propertyRepository.ExecuteSP<Property> ("GETTIMEWEIGHTEDLAST90VIEWS", parameters).ToList ();
            return data;
        }

           public List<RankedPropertyVM> GetViewerStrength (SearchVM searchVM) {

            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@swlat", Value = searchVM.SwLat },
                new SqlParameter { ParameterName = "@nelat", Value = searchVM.NeLat },
                new SqlParameter { ParameterName = "@swlng", Value = searchVM.SwLng },
                new SqlParameter { ParameterName = "@nelng", Value = searchVM.NeLng },
                new SqlParameter { ParameterName = "@Suburb", Value = searchVM.SearchTerm },
                new SqlParameter { ParameterName = "@from", Value = searchVM.From },
                new SqlParameter { ParameterName = "@to", Value = searchVM.To },
                new SqlParameter { ParameterName = "@Bedrooms", Value = searchVM.Bedrooms },
                new SqlParameter { ParameterName = "@Bathrooms", Value = searchVM.Bathrooms },
                new SqlParameter { ParameterName = "@Status", Value = searchVM.Status },
                new SqlParameter { ParameterName = "@IsExactMatchBed", Value = searchVM.IsExactMatchBed },
                new SqlParameter { ParameterName = "@IsExactMatchBath", Value = searchVM.IsExactMatchBath },
                new SqlParameter { ParameterName = "@MinPrice", Value = searchVM.MinPrice },
                new SqlParameter { ParameterName = "@MaxPrice", Value = searchVM.MaxPrice },
                new SqlParameter { ParameterName = "@IsSurroundingSuburb", Value = searchVM.IsSurroundingSuburb }
            };

            var data = _propertyRepository.ExecuteSP<RankedPropertyVM> ("GETVIEWERSTRENGTH", parameters).ToList ();
            return data;
        }

        public PropertyCrudData CheckAndUpdateActivePropertyForAdmin (PropertyCrudData property) {
            var existingItem = GetMany (t => t.Id == property.Id).Result.FirstOrDefault ();
            if (existingItem != null) {
                return UpdateActivePropertyForAdmin (existingItem, property);
            }
            return null;
        }

        public PropertyCrudData UpdateActivePropertyForAdmin (PropertyCrudData existingItem, PropertyCrudData property) {
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
    }

    public partial interface IPropertyCrudDataService : IService<PropertyCrudData> {
        List<PropertyCrudData> GetAllPropertyCrudData (string searchTerm);
        List<Property> GetAllProperties (SearchVM searchVM);
        PropertyCrudData CheckInsertOrUpdate (PropertyCrudData property);
        PropertyCrudData GetPropertyCrudDataByPropertyDetailId (int propertyDetailId);
        List<PropertyCrudData> GetAllPropertyCrudDataInTimePeriod (List<int> propDetailIds);
        PropertyCrudData RemovePropertyCrudData (PropertyCrudData propertyCrudData);
        List<ViewCountVM> GetActiveInActiveViewCount (SearchVM searchVM);
        List<Property> GetSubHurbSimilarProperties (SearchVM searchVM);
        List<PropertyView> GetPropertyViewBasedOnDetailId (SearchPropertyViewModel Model);
        PropertyCrudData CheckAndUpdateActivePropertyForAdmin (PropertyCrudData property);
        List<RankedPropertyVM> GetRankedProperties (SearchVM searchVM);
        List<Property> GetLast90View (SearchVM searchVM);
        List<Property> GetTimeWeightedLast90View (SearchVM searchVM);
        List<RankedPropertyVM> GetViewerStrength (SearchVM searchVM);

        // Bhavesh Ladva
        List<RankedPropertyVM> GetBuzzProperty (SearchVM searchVM);

    }
}
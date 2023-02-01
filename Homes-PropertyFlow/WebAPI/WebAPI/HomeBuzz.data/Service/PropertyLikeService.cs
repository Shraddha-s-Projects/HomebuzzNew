using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data {
    public partial class PropertyLikeService : ServiceBase<PropertyLike>, IPropertyLikeService {
        private readonly IPropertyRepository _propertyRepository;
        public PropertyLikeService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public PropertyLikeVM LikeDislikeProperty (PropertyLike property) {
            var existingItem = GetMany (t => t.PropertyDetailId == property.PropertyDetailId && t.UserId == property.UserId).Result.FirstOrDefault ();
            PropertyLikeVM PropertyLikeVM = new PropertyLikeVM ();
            PropertyLikeVM.PropertyDetailId = property.PropertyDetailId;
            PropertyLikeVM.UserId = property.UserId;

            //property exist then remove
            if (existingItem != null) {

                var likeObj = RemoveProperty (existingItem);
                PropertyLikeVM.Id = likeObj.Id;
                PropertyLikeVM.Status = "Dislike";
                return PropertyLikeVM;
            }
            //Add new
            else {
                var likeObj = InsertProperty (property);
                PropertyLikeVM.Id = likeObj.Id;
                PropertyLikeVM.Status = "Like";
                return PropertyLikeVM;
            }
        }
        public PropertyLike InsertProperty (PropertyLike property) {
            property.LikedOn = DateTime.Now; // set as 1

            var newItem = Add (property);
            SaveAsync ();

            return newItem;
        }
        public PropertyLike RemoveProperty (PropertyLike existingItem) {
            Delete (existingItem);
            SaveAsync ();

            return existingItem;
        }

        public List<PropertyLike> GetAllPropertyLikes (List<int> propDetaisIds) {
            var propLikes = GetAllAsync ().Result
                .Join (propDetaisIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propLikes;
        }

        public PropertyLike GetPropertyLike (int propDetailId) {
            return GetMany (t => t.PropertyDetailId == propDetailId).Result.FirstOrDefault ();
        }

        public List<UserPropertyLikes> GetUserPropertyLikes (Int64 userId) {
            SqlParameter[] parameters = { new SqlParameter { ParameterName = "@userId", Value = userId } };

            var userPropertyLikes = _propertyRepository.ExecuteSP<UserPropertyLikes> ("GETUSERPROPERTYLIKES", parameters).ToList ();

            return userPropertyLikes;
        }

        public List<PropertyLike> GetAllPropertyLikeInTimePeriod (List<int> propDetailIds) {

            var propLikes = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propLikes;
        }

        public List<UserPropertyInfo> GetUserPropertyInfo (Int64 userId) {
            SqlParameter[] parameters = { new SqlParameter { ParameterName = "@userId", Value = userId } };

            var userPropertyInfo = _propertyRepository.ExecuteSP<UserPropertyInfo> ("GETUSERINFO", parameters).ToList ();

            return userPropertyInfo;
        }
    }

    public partial interface IPropertyLikeService : IService<PropertyLike> {
        PropertyLikeVM LikeDislikeProperty (PropertyLike property);

        List<PropertyLike> GetAllPropertyLikes (List<int> propDetaisIds);

        PropertyLike GetPropertyLike (int propDetailId);

        List<UserPropertyLikes> GetUserPropertyLikes (Int64 userId);

        List<PropertyLike> GetAllPropertyLikeInTimePeriod (List<int> propDetailIds);

        PropertyLike RemoveProperty (PropertyLike existingItem);

        List<UserPropertyInfo> GetUserPropertyInfo (Int64 userId);
    }
}
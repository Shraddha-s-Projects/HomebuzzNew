using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data {
    public partial class PropertyClaimService : ServiceBase<PropertyClaim>, IPropertyClaimService {
        private readonly IPropertyRepository _propertyRepository;
        public PropertyClaimService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public PropertyClaim CheckInsertOrUpdate (PropertyClaim propertyClaim) {
            var existingItem = GetMany (t => t.PropertyDetailId == propertyClaim.PropertyDetailId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdateClaim (existingItem, propertyClaim);
            } else {
                return InsertClaim (propertyClaim);
            }
        }
        public PropertyClaim InsertClaim (PropertyClaim propertyClaim) {
            propertyClaim.ClaimedOn = DateTime.Now;
            propertyClaim.IsReadTerms = true;

            var newItem = Add (propertyClaim);
            SaveAsync ();

            return newItem;
        }
        public PropertyClaim UpdateClaim (PropertyClaim existingItem, PropertyClaim propertyClaim) {

            UpdateAsync (existingItem, propertyClaim.Id);
            SaveAsync ();

            return existingItem;
        }
        public List<PropertyClaim> GetAllClaims (long ownerId) {
            return GetMany (x => x.OwnerId == ownerId).Result.ToList ();
        }

        public PropertyClaim GetPropertyClaimById (int propertyClaimId) {
            return GetMany (x => x.Id == propertyClaimId).Result.FirstOrDefault ();
        }

        public PropertyClaim GetPropertyClaimByPropertyDetailId (int propertyDetailId) {
            return GetMany (x => x.PropertyDetailId == propertyDetailId).Result.FirstOrDefault ();
        }

        public List<PropertyClaim> GetAllPropertyClaimsInTimePeriod (List<int> propDetailIds) {

            var propDetails = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propDetails;
        }

          public List<PropertyClaim> NotifyExpireClaim (int To) {
            DateTime toPeriod = DateTime.Now.AddDays (-To);
            var propClaims = GetAllAsync ().Result.Where (p => p.ClaimedOn <= toPeriod).ToList ();
            return propClaims;
        }

        public PropertyClaim RemovePropertyClaim (PropertyClaim propertyClaim) {
            Delete (propertyClaim);
            SaveAsync ();
            return propertyClaim;
        }

        public List<UserPropertyClaim> GetUserPropertyClaims (Int64 userId) {
            SqlParameter[] parameters = { new SqlParameter { ParameterName = "@userId", Value = userId } };

            var userPropertyClaims = _propertyRepository.ExecuteSP<UserPropertyClaim> ("GETUSERPROPERTYCLAIMS", parameters).ToList ();

            return userPropertyClaims;
        }
    }

    public partial interface IPropertyClaimService : IService<PropertyClaim> {
        PropertyClaim CheckInsertOrUpdate (PropertyClaim propertyClaimId);

        List<PropertyClaim> GetAllClaims (long ownerId);

        PropertyClaim GetPropertyClaimById (int claimId);

        PropertyClaim GetPropertyClaimByPropertyDetailId (int propertyDetailId);

        PropertyClaim RemovePropertyClaim (PropertyClaim propertyClaim);

        List<UserPropertyClaim> GetUserPropertyClaims (long userId);

        List<PropertyClaim> GetAllPropertyClaimsInTimePeriod (List<int> propDetailIds);
    }

}
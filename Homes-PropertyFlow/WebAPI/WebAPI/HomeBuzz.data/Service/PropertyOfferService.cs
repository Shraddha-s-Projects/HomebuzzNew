using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data {
    public partial class PropertyOfferService : ServiceBase<PropertyOffer>, IPropertyOfferService {
        private readonly IPropertyRepository _propertyRepository;
        public PropertyOfferService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public PropertyOffer CheckInsertOrUpdate (PropertyOffer Offer) {
            var existingItem = GetMany (t => t.PropertyDetailId == Offer.PropertyDetailId && t.UserId == Offer.UserId).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdateOffer (existingItem, Offer);
            } else {
                return InsertOffer (Offer);
            }
        }
        public PropertyOffer InsertOffer (PropertyOffer Offer) {
            Offer.OfferedOn = DateTime.Now;
            Offer.Status = "Open";

            var newItem = Add (Offer);
            SaveAsync ();

            return newItem;
        }
        public PropertyOffer UpdateOffer (PropertyOffer existingItem, PropertyOffer Offer) {

            UpdateAsync (existingItem, Offer.Id);
            SaveAsync ();

            return existingItem;
        }
        public List<PropertyOffer> GetAllOffers (long userId) {
            return GetMany (x => x.UserId == userId).Result.ToList ();
        }

        public List<UserPropertyOffer> GetAllOffersByPropertyDetailId (int propertyDetailId) {
            List<UserPropertyOffer> userOffers = new List<UserPropertyOffer> ();

            SqlParameter[] parameters = { new SqlParameter { ParameterName = "@propertyDetailId", Value = propertyDetailId } };

            var userPropertyOffers = _propertyRepository.ExecuteSP<UserPropertyOffer> ("GETALLPROPERTYOFFERS", parameters).ToList ();

            return userPropertyOffers;
        }

        public PropertyOffer GetPropertyOfferById (int OfferId) {
            return GetMany (x => x.Id == OfferId).Result.FirstOrDefault ();
        }

        public List<PropertyOffer> GetAllPropertyOffers (List<int> propDetaisIds) {
            var propLikes = GetAllAsync ().Result
                .Join (propDetaisIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

            return propLikes;
        }

        public List<UserPropertyOffer> GetUserPropertyOffers (Int64 userId) {
            List<UserPropertyOffer> userOffers = new List<UserPropertyOffer> ();

            SqlParameter[] parameters = { new SqlParameter { ParameterName = "@ownerId", Value = userId } };

            var userPropertyOffers = _propertyRepository.ExecuteSP<UserPropertyOffer> ("GETUSERPROPERTYOFFERS", parameters).ToList ();

            return userPropertyOffers;
        }

        public PropertyOffer RemovePropertyOffer (PropertyOffer propertyOffer) {
            Delete (propertyOffer);
            SaveAsync ();
            return propertyOffer;
        }

        public List<PropertyOffer> GetAllPropertyOfferssInTimePeriod (int To) {
            DateTime toPeriod = DateTime.Now.AddDays (-To);
            var propOffers = GetAllAsync ().Result.Where (p => p.OfferedOn <= toPeriod).ToList ();
            return propOffers;
        }

        public List<PropertyOffer> GetAllDeActivePropertyOffers (List<int> propDetailIds) {

			var propOffers = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

			return propOffers;
		}
    }

    public partial interface IPropertyOfferService : IService<PropertyOffer> {
        PropertyOffer CheckInsertOrUpdate (PropertyOffer Offer);

        List<PropertyOffer> GetAllOffers (long userId);

        List<UserPropertyOffer> GetUserPropertyOffers (long userId);

        PropertyOffer GetPropertyOfferById (int OfferId);

        List<PropertyOffer> GetAllPropertyOffers (List<int> propDetaisIds);

        PropertyOffer RemovePropertyOffer (PropertyOffer propertyOffer);

        List<UserPropertyOffer> GetAllOffersByPropertyDetailId (int propertyDetailId);

        List<PropertyOffer> GetAllPropertyOfferssInTimePeriod (int To);

        List<PropertyOffer> GetAllDeActivePropertyOffers (List<int> propDetailIds);

    }
}
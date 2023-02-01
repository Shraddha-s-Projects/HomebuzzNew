using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {
	public partial class PropertyImageService : ServiceBase<PropertyImage>, IPropertyImageService {
		private readonly IPropertyRepository _propertyRepository;
		public PropertyImageService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
			_propertyRepository = propertyRepository;
		}
		public List<PropertyImage> GetAllByPropertyDetailId (int PropertyDetailId) {
			return GetMany (t => t.PropertyDetailId == PropertyDetailId).Result.ToList ();
		}

		public PropertyImage GetImageById (int imageId) {
			return GetMany (t => t.Id == imageId).Result.FirstOrDefault ();
		}

		public PropertyImage CheckInsertOrUpdate (PropertyImage propertyImage) {
			var existingItem = GetMany (t => t.Id == propertyImage.Id).Result.FirstOrDefault ();

			//property exist
			if (existingItem != null) {
				return UpdatePropertyImage (existingItem, propertyImage);
			}
			//Add new
			else {
				return InsertPropertyImage (propertyImage);
			}
		}

		public PropertyImage RemovePropertyImage (PropertyImage propertyImage) {
			Delete (propertyImage);
			SaveAsync ();
			return propertyImage;
		}

		public PropertyImage InsertPropertyImage (PropertyImage propertyImage) {
			var newItem = Add (propertyImage);
			SaveAsync ();

			return newItem;
		}
		public PropertyImage UpdatePropertyImage (PropertyImage existingItem, PropertyImage propertyImage) {
			UpdateAsync (existingItem, propertyImage.Id);
			SaveAsync ();

			return existingItem;
		}

		public List<PropertyImage> GetAllPropertyImageInTimePeriod (List<int> propDetailIds) {

			var propImages = GetAllAsync ().Result.Join (propDetailIds, sc => sc.PropertyDetailId, pli => pli, (sc, pli) => sc).ToList ();

			return propImages;
		}
	}

	public partial interface IPropertyImageService : IService<PropertyImage> {
		List<PropertyImage> GetAllByPropertyDetailId (int PropertyDetailId);

		PropertyImage GetImageById (int imageId);

		PropertyImage CheckInsertOrUpdate (PropertyImage propertyImage);

		PropertyImage RemovePropertyImage (PropertyImage propertyImage);
		
		List<PropertyImage> GetAllPropertyImageInTimePeriod (List<int> propDetailIds);
	}
}
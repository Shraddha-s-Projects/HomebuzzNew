using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels {
	public class PropertyVM {

	}

	public class UserPropertyOffer {
		public Int64 Id { get; set; }

		public string Address { get; set; }
		public string Suburb { get; set; }
		public string City { get; set; }
		public decimal OfferingAmount { get; set; }
		public string Status { get; set; }

		public int PropertyDetailId { get; set; }

		public DateTime? PropertyOfferedDate { get; set; }
		public DateTime? PropertyActivatedDate { get; set; }
	}

	public class UserPropertyClaim {
		public Int64 Id { get; set; }

		public string Address { get; set; }
		public string Suburb { get; set; }
		public string City { get; set; }
		public decimal HomebuzzEstimate { get; set; }
		public string Bedrooms { get; set; }
		public string Bathrooms { get; set; }
		public string CarSpace { get; set; }
		public string HomeStatus { get; set; }
		public int UserId { get; set; }
		public int PropertyDetailId { get; set; }
		public string Landarea { get; set; }
		public decimal AskingPrice { get; set; }
		public string Status { get; set; }
		public string Time { get; set; }
		public string Day { get; set; }
		public List<UserPropertyOffer> Offers { get; set; }

		public DateTime? PropertyClaimedDate { get; set; }
		public DateTime? ActivatedOn { get; set; }
		public int DayLeft { get; set; }
	}

	public class SearchVM {
		public string SearchTerm { get; set; }
		public decimal SwLat { get; set; }
		public decimal NeLat { get; set; }
		public decimal SwLng { get; set; }
		public decimal NeLng { get; set; }
		public string AddressType { get; set; }
		public string Bedrooms { get; set; }
		public string Bathrooms { get; set; }
		public string Status { get; set; }
		public int From { get; set; }
		public int To { get; set; }
		public int? UserId { get; set; }
		public string UserKey { get; set; }
		public int? PageNum { get; set; }
		public int? PropertyDetailId { get; set; }
		public int? PropertyId { get; set; }
		public int? MaxPrice { get; set; }
		public int? MinPrice { get; set; }
		public bool IsExactMatchBed { get; set; } = false;
		public bool IsExactMatchBath { get; set; } = false;
		public bool IsSurroundingSuburb { get; set; } = false;
		public AddressComponentVM[] AddressComponent { get; set; }
	}

	public class PropertyLikeVM {
		public int Id { get; set; }
		public int? PropertyDetailId { get; set; }
		public long? UserId { get; set; }
		public DateTime LikedOn { get; set; }
		public int? PropertyId { get; set; }
		public string Status { get; set; }
	}

	public class UserPropertyLikes {
		public int Id { get; set; }
		public int PropertyDetailId { get; set; }
		public int UserId { get; set; }
		public string Address { get; set; }
		public string Suburb { get; set; }
		public string City { get; set; }
	}

	public class SearchLatLongVM {
		public string SearchTerm { get; set; }
		public string Lat { get; set; }
		public string Lng { get; set; }
		public long? UserId { get; set; }
		public AddressComponentVM[] AddressComponent { get; set; }
	}

	public class AddressComponentVM {
		public string long_name { get; set; }
		public string short_name { get; set; }
		public string[] types { get; set; }
	}

	public class ViewCountVM {
		public int ActiveHomes { get; set; }
		public int InActiveHomes { get; set; }
		public int AverageCount { get; set; }
		public decimal AverageEstimatePrice { get; set; }
		public double AveragePercentage { get; set; }
		public decimal AveragePropertyLikes { get; set; }
	}

	public class UserPropertyInfo {
		public long UserId { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public bool IsEmailVerified { get; set; }
		public int likes { get; set; }
		public int offers { get; set; }
		public int claims { get; set; }
		public int searches { get; set; }
	}

	public class SubHurbPropertyInfo {
		public int CommercialCount { get; set; }
		public int Units { get; set; }
		public int Houses { get; set; }
		public int TownHomes { get; set; }
		public int TotalProperties { get; set; }
		public int ActiveProperties { get; set; }
		public int ViewedProperties { get; set; }
		public int ClaimedProperties { get; set; }
		public int ForSaleProperties { get; set; }
		public decimal AverageEstimatePrice { get; set; }

	}

	public class AdminPropertyVM {
		public int Id { get; set; }
		public int PropertyDetailId { get; set; }
		public int? PropertyId { get; set; }
		public string Address { get; set; }
		public string Suburb { get; set; }
		public string City { get; set; }
		public decimal? HomebuzzEstimate { get; set; }
		public decimal? AskingPrice { get; set; }
		public string Bedrooms { get; set; }
		public string Bathrooms { get; set; }
		public string CarSpace { get; set; }
		public string Landarea { get; set; }
		public bool IsActive { get; set; }
		public string Status { get; set; }
		public string Description { get; set; }
		public string LatitudeLongitude { get; set; }
		public string Latitude { get; set; }
		public string Longitude { get; set; }
		public long TotalCount { get; set; }
		public string OrderColumnName { get; set; }
		public string OrderColumnDir { get; set; }
		public int PageNum { get; set; }
		public int PageSize { get; set; }
	}

}
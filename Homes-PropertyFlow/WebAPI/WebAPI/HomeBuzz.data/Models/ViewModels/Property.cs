using System;
using System.Collections.Generic;
using System.Text;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Models.ViewModels {
    public class Property {
        public int Id { get; set; }

        public int PropertyCrudDataId { get; set; }

        public int PropertyDetailId { get; set; }

        public int PropertyId { get; set; }

        public string Address { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }
        public decimal? HomebuzzEstimate { get; set; }
        public decimal? AskingPrice { get; set; }
        public string Bedrooms { get; set; }
        public string Bathrooms { get; set; }
        public string CarSpace { get; set; }
        public string Landarea { get; set; }
        public string LatitudeLongitude { get; set; }
        public bool IsActive { get; set; }
        public bool IsClaimed { get; set; }
        public bool IsAgentListProperty { get; set; }
        public bool IsOpenHome { get; set; }
        public long ViewCount { get; set; }
        public long? ComparativeInterest { get; set; }
        public long ViewBlock { get; set; }
        public long PerformanceRange { get; set; }
        public long HigherPerformanceRange { get; set; }
        public long LowerPerformanceRange { get; set; }
        public string Performance { get; set; }
        public long? OwnerId { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string Day { get; set; }
        public string Time { get; set; }
        public string ImageIds { get; set; }
        public bool UserLiked { get; set; }
        public bool UserOffered { get; set; }
        public long OfferedCount { get; set; }
        public long TotalCount { get; set; }
        public long MaxViewCount { get; set; }
        public string HomeType { get; set; }
        public string[] ImageIdList { get; set; }
        public DateTime ActivatedDate { get; set; }
        public DateTime? OpenedDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Decimal? AppraisalPrice { get; set; }
        public string GoogleImage { get; set; }
        public bool IsShowAskingPrice { get; set; }
        public int? AgentOptionId { get; set; }
        public long? AgentId { get; set; }
        public long? DayLeft { get; set; }
        public string AgentOption { get; set; }
        public bool IsViewedInWeek { get; set; }
        public DateTime ViewedDate { get; set; }
        public DateTime LastViewed { get; set; }
        public List<PropertyLike> PropertyLikes { get; set; }
        public PropertyClaim PropertyClaim { get; set; }
        public List<PropertyOffer> PropertyOffers { get; set; }
        public PropertyData PropertyData { get; set; }
        public List<PropertyView> PropertyView { get; set; }
    }

    public class SearchPropertyViewModel {

        public long? UserId { get; set; }

        public string UserKey { get; set; }
        public string PropertydetailIds { get; set; }

    }
}
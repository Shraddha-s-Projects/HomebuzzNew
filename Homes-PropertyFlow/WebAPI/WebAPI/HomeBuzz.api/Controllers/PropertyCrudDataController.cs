using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.BusinessLogic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/PropertyCrudData")]
    public class PropertyCrudDataController : Controller {

        private readonly IPropertyDataService _propertyDataService;
        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyLikeService _propertyLikeService;
        private readonly IPropertyOfferService _propertyOfferService;
        private readonly IPropertyRepository _propertyRepository;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IPropertyImageService _propertyImageService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;
        private readonly IPropertyStatusService _propertyStatusService;
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private ErrorLogService errorlogservice;
        private IPropertyNotifyService _propertyNotifyService;
        private PropertySearch propertySearch;

        #region 'Constructor'
        public PropertyCrudDataController (IPropertyDataService propertyDataService,
            IPropertyDetailService propertyDetailService,
            IPropertyCrudDataService propertyCrudDataService,
            IPropertyViewService propertyViewService,
            IPropertyImageService propertyImageService,
            IPropertyLikeService propertyLikeService,
            IPropertyOfferService propertyOfferService,
            IPropertyStatusService propertyStatusService,
            HomeBuzzContext context,
            IPropertyRepository propertyRepository,
            IUserService userService,
            IEmailTemplateService emailTemplateService,
            IPropertyNotifyService propertyNotifyService) {
            _propertyDataService = propertyDataService;
            _propertyDetailService = propertyDetailService;
            _propertyLikeService = propertyLikeService;
            _propertyOfferService = propertyOfferService;
            _propertyViewService = propertyViewService;
            _propertyImageService = propertyImageService;
            _propertyCrudDataService = propertyCrudDataService;
            _propertyStatusService = propertyStatusService;
            _userService = userService;
            _emailTemplateService = emailTemplateService;
            _propertyNotifyService = propertyNotifyService;
            errorlogservice = new ErrorLogService (context);
            propertySearch = new PropertySearch (propertyDataService, propertyDetailService, propertyLikeService, propertyRepository, propertyCrudDataService, propertyViewService, propertyImageService, propertyStatusService,
                userService, emailTemplateService, propertyNotifyService, context);
        }
        #endregion

        [AllowAnonymous]
        [HttpPost ("GetAllPropertyCrudData")]
        public async Task<OperationResult<List<Property>>> GetAllPropertyCrudData ([FromBody] SearchVM searchVM) {
            List<Property> propertyList = new List<Property> ();
            try {
                // if (!string.IsNullOrEmpty (searchVM.SearchTerm)) {
                if (searchVM != null) {
                    //if (!string.IsNullOrEmpty (searchVM.SearchTerm)) {
                    //    foreach (var address in searchVM.AddressComponent) {
                    //        searchVM.SearchTerm = searchVM.SearchTerm.Replace (address.short_name, address.long_name);
                    //    }
                    //    var a = searchVM.SearchTerm.Split (", New Zealand");
                    //    searchVM.SearchTerm = a[0].Remove (a[0].Length - 5);
                    //}

                    //if (searchVM.AddressType == "street_address")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[1].long_name.ToString() + ", " + searchVM.AddressComponent[2].long_name.ToString();
                    //}
                    //else if (searchVM.AddressComponent != null)
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "administrative_area_level_1")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "administrative_area_level_2")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "administrative_area_level_3")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "administrative_area_level_4")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "administrative_area_level_5")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "colloquial_area")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "locality" || searchVM.AddressType == "political")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "sublocality" || searchVM.AddressType == "sublocality_level_1" || searchVM.AddressType == "political")
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[0].long_name.ToString() + ", " + searchVM.AddressComponent[1].long_name.ToString();
                    //}
                    //else if (searchVM.AddressType == "neighborhood") { }
                    //else if (searchVM.AddressType == "premise") { }
                    //else if (searchVM.AddressType == "subpremise") { }
                    //else if (searchVM.AddressType == "natural_feature") { }
                    //else if (searchVM.AddressType == "airport ") { }
                    //else if (searchVM.AddressType == "park") { }
                    //else if (searchVM.AddressType == "point_of_interest ") { }
                    //else
                    //{
                    // searchVM.SearchTerm = null;
                    //}

                    //if (searchVM.AddressComponent != null)
                    //{
                    //    searchVM.SearchTerm = searchVM.AddressComponent[1].long_name.ToString() + ", " + searchVM.AddressComponent[2].long_name.ToString();
                    //}

                    propertyList = propertySearch.SearchPropertyCrudData (searchVM).Result;
                    var propertyDetailList = "";
                    foreach (var item in propertyList) {
                        if (item.ImageIds != null) {
                            item.ImageIdList = item.ImageIds.Split (",");
                        }
                        if (propertyDetailList != "") {
                            propertyDetailList = propertyDetailList + ",";
                        }
                        propertyDetailList = propertyDetailList + item.PropertyDetailId;

                    }
                    if (propertyList.Count > 0) {
                        SearchPropertyViewModel model = new SearchPropertyViewModel ();
                        model.UserId = searchVM.UserId;
                        model.PropertydetailIds = propertyDetailList;
                        model.UserKey = searchVM.UserKey;
                        var propertyViewList = _propertyCrudDataService.GetPropertyViewBasedOnDetailId (model);
                        foreach (var item in propertyList) {
                            var propertyviewCollection = propertyViewList.Where (t => t.PropertyDetailId == item.PropertyDetailId);
                            var today = DateTime.Today;
                            // Console.Write ("today", today.ToString ());
                            var ActivatedDate = item.ActivatedDate.Date.AddHours (00).AddMinutes (00).AddSeconds (00);
                            var SevenDays = ActivatedDate.AddDays (7).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var EightDays = ActivatedDate.AddDays (8);
                            var FourteenDays = ActivatedDate.AddDays (14).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var FifteenDays = ActivatedDate.AddDays (15);
                            var TwentyOneDays = ActivatedDate.AddDays (21).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var TwentyTwoDays = ActivatedDate.AddDays (22);
                            var TwentyEightDays = ActivatedDate.AddDays (28).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            if (today >= ActivatedDate && today <= SevenDays) {
                                var duplicate = propertyviewCollection.Where (t => t.ViewDate >= ActivatedDate && t.ViewDate <= SevenDays).Count ();
                                if (duplicate > 0) {
                                    item.IsViewedInWeek = true;
                                }
                            } else if (today >= EightDays && today <= FourteenDays) {
                                var duplicate = propertyviewCollection.Where (t => t.ViewDate >= EightDays && t.ViewDate <= FourteenDays).Count ();
                                if (duplicate > 0) {
                                    item.IsViewedInWeek = true;
                                }
                            } else if (today >= FifteenDays && today <= TwentyOneDays) {
                                var duplicate = propertyviewCollection.Where (t => t.ViewDate >= FifteenDays && t.ViewDate <= TwentyOneDays).Count ();
                                if (duplicate > 0) {
                                    item.IsViewedInWeek = true;
                                }
                            } else if (today >= TwentyTwoDays && today <= TwentyEightDays) {
                                var duplicate = propertyviewCollection.Where (t => t.ViewDate >= TwentyTwoDays && t.ViewDate <= TwentyEightDays).Count ();
                                if (duplicate > 0) {
                                    item.IsViewedInWeek = true;
                                }
                            }
                        }
                    
                }
            }
            return new OperationResult<List<Property>> (true, "", propertyList);
        } catch (Exception ex) {
            errorlogservice.LogException (ex);
            return new OperationResult<List<Property>> (false, CommonMessage.DefaultErrorMessage);
        }
    }

    [AllowAnonymous]
    [HttpPost ("GetAllPropertyViews")]
    public async Task<OperationResult<List<Property>>> GetAllPropertyViews ([FromBody] SearchVM searchVM) {
        List<Property> query = new List<Property> ();
        try {
            if (searchVM != null) {
                if (searchVM.Bedrooms == "") {
                    searchVM.Bedrooms = null;
                }
                if (searchVM.Bathrooms == "") {
                    searchVM.Bathrooms = null;
                }
                if (searchVM.Status == "") {
                    searchVM.Status = null;
                }
                query = propertySearch.SearchPropertyView (searchVM).Result;
                foreach (var item in query) {
                    if (item.ImageIds != null) {
                        item.ImageIdList = item.ImageIds.Split (",");
                    }
                }
            }
            return new OperationResult<List<Property>> (true, "", query);
        } catch (Exception ex) {
            errorlogservice.LogException (ex);
            return new OperationResult<List<Property>> (false, CommonMessage.DefaultErrorMessage);
        }
    }

    [AllowAnonymous]
    [HttpGet ("IncreaseViewCount")]
    public async Task<OperationResult<PropertyDetail>> IncreaseViewCount (int PropertyDetailId) {
        PropertyDetail obj = new PropertyDetail ();
        try {
            obj.Id = PropertyDetailId;
            var result = _propertyDetailService.CheckInsertOrUpdate (obj, true);
            return new OperationResult<PropertyDetail> (true, "", result);
        } catch (Exception ex) {
            errorlogservice.LogException (ex);
            return new OperationResult<PropertyDetail> (false, CommonMessage.DefaultErrorMessage);
        }
    }

    [AllowAnonymous]
    [HttpPost ("SavePropertyCRUD")]
    public async Task<OperationResult<List<Property>>> SavePropertyCRUD ([FromBody] SearchLatLongVM searchVM) {
        try {
            List<Property> query = new List<Property> ();
            PropertyCrudData propertyCrudData = new PropertyCrudData ();
            var StatusList = _propertyStatusService.GetMany (t => t.IsDeleted == false).Result.ToList ();
            var propertyDetail = new PropertyDetail ();
            if (!string.IsNullOrEmpty (searchVM.SearchTerm)) {
                // foreach (var address in searchVM.AddressComponent) {
                //     searchVM.SearchTerm = searchVM.SearchTerm.Replace (address.short_name, address.long_name);
                // }
                var a = searchVM.SearchTerm.Split (", New Zealand");
                var searchTerm = a[0].Remove (a[0].Length - 5);
                var propertyData = _propertyDataService.GetAllMasterProperties (searchTerm);
                foreach (var item in propertyData) {
                    var property = new Property ();
                    property.Id = item.Id;
                    property.Address = item.Address;
                    property.Suburb = item.Suburb;
                    property.City = item.City;
                    property.HomebuzzEstimate = item.HomebuzzEstimate;
                    property.Bedrooms = item.Bedrooms;
                    property.Bathrooms = item.Bathrooms;
                    property.CarSpace = item.CarSpace;
                    property.Landarea = item.Landarea;
                    property.PropertyDetailId = item.PropertyDetailId;
                    property.IsActive = item.IsActive;
                    property.IsClaimed = item.IsClaimed;
                    property.ViewCount = item.ViewCount;
                    if (searchVM.UserId != null) {
                        property.OwnerId = searchVM.UserId.Value;
                    } else {
                        property.OwnerId = searchVM.UserId;
                    }
                    property.LatitudeLongitude = item.LatitudeLongitude;
                    property.Status = item.Status;
                    property.Description = item.Description;
                    property.Day = item.Day;
                    property.TotalCount = item.TotalCount;
                    property.HomeType = item.HomeType;
                    query.Add (property);
                }
                if (propertyData.Count == 1) {
                    PropertyDetail obj = new PropertyDetail ();
                    var propertyId = propertyData[0].Id;
                    propertyDetail = _propertyDetailService.GetPropertyByPropertyId (propertyId);
                    if (propertyDetail == null) {
                        obj.PropertyId = propertyData[0].Id;
                        obj.Status = "Not listed";
                        obj.StatusId = StatusList.Where (t => t.Name == "Not listed").FirstOrDefault ().Id;
                        obj.IsClaimed = false;
                        obj.IsActive = true;
                        obj.ActivatedDate = DateTime.UtcNow;
                        if (searchVM.UserId != null) {
                            obj.OwnerId = searchVM.UserId.Value;
                        } else {
                            obj.OwnerId = searchVM.UserId;
                        }
                        var result = _propertyDetailService.CheckInsertOrUpdate (obj, false);
                        var propertyCrudDataObj = _propertyCrudDataService.GetPropertyCrudDataByPropertyDetailId (result.Id);
                        if (propertyCrudDataObj == null) {
                            propertyCrudData.PropertyDetailId = result.Id;
                            propertyCrudData.Address = propertyData[0].Address;
                            propertyCrudData.Suburb = propertyData[0].Suburb;
                            propertyCrudData.City = propertyData[0].City;
                            propertyCrudData.HomebuzzEstimate = propertyData[0].HomebuzzEstimate;
                            propertyCrudData.AskingPrice = propertyData[0].HomebuzzEstimate;
                            propertyCrudData.Bedrooms = propertyData[0].Bedrooms;
                            propertyCrudData.Bathrooms = propertyData[0].Bathrooms;
                            propertyCrudData.CarSpace = propertyData[0].CarSpace;
                            propertyCrudData.Landarea = propertyData[0].Landarea;
                            propertyCrudData.LatitudeLongitude = propertyData[0].LatitudeLongitude;
                            if (propertyData[0].LatitudeLongitude != null) {
                                var latlong = propertyData[0].LatitudeLongitude.Split (",");
                                propertyCrudData.Latitude = Convert.ToDecimal (latlong[0]);
                                propertyCrudData.Longitude = Convert.ToDecimal (latlong[1]);
                            }
                            var AddOrUpdatePropertyCrudData = _propertyCrudDataService.CheckInsertOrUpdate (propertyCrudData);
                        }
                    } else {
                        var propertyCrudDataObj = _propertyCrudDataService.GetPropertyCrudDataByPropertyDetailId (propertyDetail.Id);
                        if (propertyCrudDataObj == null) {
                            propertyCrudData.PropertyDetailId = propertyDetail.Id;
                            propertyCrudData.Address = propertyData[0].Address;
                            propertyCrudData.Suburb = propertyData[0].Suburb;
                            propertyCrudData.City = propertyData[0].City;
                            propertyCrudData.HomebuzzEstimate = propertyData[0].HomebuzzEstimate;
                            propertyCrudData.Bedrooms = propertyData[0].Bedrooms;
                            propertyCrudData.Bathrooms = propertyData[0].Bathrooms;
                            propertyCrudData.CarSpace = propertyData[0].CarSpace;
                            propertyCrudData.Landarea = propertyData[0].Landarea;
                            propertyCrudData.LatitudeLongitude = propertyData[0].LatitudeLongitude;
                            if (propertyData[0].LatitudeLongitude != null) {
                                var latlong = propertyData[0].LatitudeLongitude.Split (",");
                                propertyCrudData.Latitude = Convert.ToDecimal (latlong[0]);
                                propertyCrudData.Longitude = Convert.ToDecimal (latlong[1]);
                            }
                            var AddOrUpdatePropertyCrudData = _propertyCrudDataService.CheckInsertOrUpdate (propertyCrudData);
                        }
                    }
                }
                return new OperationResult<List<Property>> (true, "", query);
            } else {
                return new OperationResult<List<Property>> (true, "", query);
            }
        } catch (Exception ex) {
            errorlogservice.LogException (ex);
            return new OperationResult<List<Property>> (false, CommonMessage.DefaultErrorMessage);
        }
    }

    [AllowAnonymous]
    [HttpPost ("AddUpdatePropertyDetailAndPropertyCRUD")]
    public async Task<OperationResult<Property>> AddUpdatePropertyDetailAndPropertyCRUD ([FromBody] Property property) {
        PropertyDetail obj = new PropertyDetail ();
        var StatusList = _propertyStatusService.GetMany (t => t.IsDeleted == false).Result.ToList ();
        obj.PropertyId = property.Id;
        obj.Status = "Not listed";
        obj.StatusId = StatusList.Where (t => t.Name == "Not listed").FirstOrDefault ().Id;
        obj.IsClaimed = false;
        obj.IsActive = true;
        obj.ActivatedDate = DateTime.UtcNow;
        var result = _propertyDetailService.CheckInsertOrUpdate (obj, false);
        property.PropertyDetailId = result.Id;
        PropertyCrudData propertyCrudData = new PropertyCrudData ();
        propertyCrudData.Address = property.Address;
        propertyCrudData.Suburb = property.Suburb;
        propertyCrudData.City = property.City;
        propertyCrudData.HomebuzzEstimate = property.HomebuzzEstimate;
        propertyCrudData.Bedrooms = property.Bedrooms;
        propertyCrudData.Bathrooms = property.Bathrooms;
        propertyCrudData.CarSpace = property.CarSpace;
        propertyCrudData.Landarea = property.Landarea;
        propertyCrudData.LatitudeLongitude = property.LatitudeLongitude;
        propertyCrudData.PropertyDetailId = result.Id;
        if (property.LatitudeLongitude != null) {
            var latlong = property.LatitudeLongitude.Split (",");
            propertyCrudData.Latitude = Convert.ToDecimal (latlong[0]);
            propertyCrudData.Longitude = Convert.ToDecimal (latlong[1]);
        }
        var AddOrUpdate = _propertyCrudDataService.CheckInsertOrUpdate (propertyCrudData);
        return new OperationResult<Property> (true, "", property);
    }

    [AllowAnonymous]
    [HttpPost ("GetSimilarProperties")]
    public async Task<OperationResult<ViewCountVM>> GetActiveInActiveCount ([FromBody] SearchVM searchVM) {
        try {
            Property prop = new Property ();

            var data = _propertyCrudDataService.GetActiveInActiveViewCount (searchVM).FirstOrDefault ();
            return new OperationResult<ViewCountVM> (true, "", data);
        } catch (Exception ex) {
            return new OperationResult<ViewCountVM> (true, ex.Message);
        }

    }

    [AllowAnonymous]
    [HttpPost ("GetAllSubHurbProperties")]
    public async Task<OperationResult<List<Property>>> GetAllSubHurbProperties ([FromBody] SearchVM searchVM) {
        List<Property> query = new List<Property> ();
        try {
            if (searchVM != null) {
                if (searchVM.Bedrooms == "") {
                    searchVM.Bedrooms = null;
                }
                if (searchVM.Bathrooms == "") {
                    searchVM.Bathrooms = null;
                }
                if (searchVM.Status == "") {
                    searchVM.Status = null;
                }
                query = propertySearch.GetSubHurbSimilarProperties (searchVM).Result;
                foreach (var item in query) {
                    if (item.ImageIds != null) {
                        item.ImageIdList = item.ImageIds.Split (",");
                    }
                }
            }
            return new OperationResult<List<Property>> (true, "", query);
        } catch (Exception ex) {
            errorlogservice.LogException (ex);
            return new OperationResult<List<Property>> (false, CommonMessage.DefaultErrorMessage);
        }
    }
}
}
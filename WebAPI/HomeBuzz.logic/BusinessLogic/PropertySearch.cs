using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;

namespace HomeBuzz.logic.BusinessLogic
{
    public class PropertySearch
    {
        #region Property Initialization
        private readonly IPropertyDataService _propertyDataService;
        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyLikeService _propertyLikeService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IPropertyImageService _propertyImageService;
        private readonly IPropertyStatusService _propertyStatusService;
        private IPropertyRepository _propertyRepository;
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private PropertyNotifyMail propertyNotifyMail;
        private IPropertyNotifyService _propertyNotifyService;
        #endregion

        public PropertySearch(IPropertyDataService propertyDataService,
            IPropertyDetailService propertyDetailService,
            IPropertyLikeService propertyLikeService,
            IPropertyRepository propertyRepository,
            IPropertyCrudDataService propertyCrudDataService,
            IPropertyViewService propertyViewService,
            IPropertyImageService propertyImageService,
            IPropertyStatusService propertyStatusService,
            IUserService userService,
            IEmailTemplateService emailTemplateService,
            IPropertyNotifyService propertyNotifyService,
            HomeBuzzContext context)
        {
            _propertyDataService = propertyDataService;
            _propertyDetailService = propertyDetailService;
            _propertyLikeService = propertyLikeService;
            _propertyRepository = propertyRepository;
            _propertyCrudDataService = propertyCrudDataService;
            _propertyViewService = propertyViewService;
            _propertyImageService = propertyImageService;
            _propertyStatusService = propertyStatusService;
            _userService = userService;
            _emailTemplateService = emailTemplateService;
            _propertyNotifyService = propertyNotifyService;
            propertyNotifyMail = new PropertyNotifyMail(userService, emailTemplateService, context);
        }

        //Get property details on full address search
        public async Task<List<Property>> SearchProperty(SearchVM searchVM)
        {
            List<Property> lstProperty = new List<Property>();

            //get all property data
            var matchedProperties = _propertyDataService.GetAllPropertyData(searchVM.SearchTerm);

            if (matchedProperties.Count == 1)
            {
                //get all property details within time period
                var propertyDetailsWithinTimePeriod = _propertyDetailService.GetAllPropertyDetailsByPropertyDataInTimePeriod(matchedProperties.ToList().Select(p => p.Id).ToList(), searchVM.From, searchVM.To);

                //get details of each from prop details
                var propertyDetailsWithinTimePeriodIds = propertyDetailsWithinTimePeriod.Select(property => property.PropertyId);

                //insert data to propertydetail table
                var propertyIdsNotActivated = matchedProperties.Where(mp => !propertyDetailsWithinTimePeriodIds.Contains(mp.Id)).Select(pna => pna.Id).ToList();

                if (propertyIdsNotActivated.Count > 0)
                {
                    var StatusList = _propertyStatusService.GetMany(t => t.IsDeleted == false).Result.ToList();
                    foreach (var Id in propertyIdsNotActivated)
                    {
                        PropertyDetail obj = new PropertyDetail();
                        obj.PropertyId = Id;
                        obj.Status = "Not listed";
                        obj.StatusId = StatusList.Where(t => t.Name == "Not listed").FirstOrDefault().Id;
                        obj.IsClaimed = false;
                        obj.IsActive = true;
                        obj.ActivatedDate = DateTime.UtcNow;
                        var result = _propertyDetailService.CheckInsertOrUpdate(obj, false);

                        PropertyCrudData propertyCrudData = new PropertyCrudData();
                        propertyCrudData.Address = matchedProperties[0].Address;
                        propertyCrudData.Suburb = matchedProperties[0].Suburb;
                        propertyCrudData.City = matchedProperties[0].City;
                        propertyCrudData.HomebuzzEstimate = matchedProperties[0].HomebuzzEstimate;
                        propertyCrudData.Bedrooms = matchedProperties[0].Bedrooms;
                        propertyCrudData.Bathrooms = matchedProperties[0].Bathrooms;
                        propertyCrudData.CarSpace = matchedProperties[0].CarSpace;
                        propertyCrudData.Landarea = matchedProperties[0].Landarea;
                        propertyCrudData.LatitudeLongitude = matchedProperties[0].LatitudeLongitude;
                        propertyCrudData.PropertyDetailId = result.Id;
                        var AddOrUpdate = _propertyCrudDataService.CheckInsertOrUpdate(propertyCrudData);

                    }
                }

                lstProperty = _propertyDataService.GetAllProperties(searchVM);
            }
            else if (matchedProperties.Count > 1)
            {
                ////get all property details within time period

                lstProperty = _propertyDataService.GetAllProperties(searchVM);
            }

            return lstProperty;
        }

        //Update PropertyCrudData
        public async Task<PropertyCrudData> UpdateProperty(Property property)
        {
            PropertyCrudData propertyCrudData = new PropertyCrudData();
            try
            {
                bool isUpdateOpenHomeFirstTime = false;
                if (property != null)
                {
                    var propertyDetail = _propertyDetailService.GetMany(t => t.Id == property.PropertyDetailId).Result.FirstOrDefault();
                    var StatusList = _propertyStatusService.GetMany(t => t.IsDeleted == false).Result.ToList();
                    if (property.HomeType == "for sale")
                    {
                        propertyDetail.Status = "For sale";
                        if ((propertyDetail.Day != null || propertyDetail.Time != null) && (property.Day != propertyDetail.Day || property.Time != propertyDetail.Time))
                        {
                            propertyDetail.OpenedDate = DateTime.Now;
                            isUpdateOpenHomeFirstTime = true;
                        }
                        propertyDetail.IsOpenHome = property.IsOpenHome;
                        propertyDetail.Day = property.Day;
                        propertyDetail.Time = property.Time;
                        if ((property.Day != null || property.Time != null) && propertyDetail.OpenedDate == null)
                        {
                            propertyDetail.OpenedDate = DateTime.Now;
                            isUpdateOpenHomeFirstTime = true;
                        }
                        propertyDetail.StatusId = StatusList.Where(t => t.Name == "For sale").FirstOrDefault().Id;
                    }
                    if (property.HomeType == "pre market")
                    {
                        propertyDetail.Status = "Pre-market";
                        propertyDetail.IsOpenHome = false;
                        propertyDetail.Day = null;
                        propertyDetail.Time = null;
                        propertyDetail.StatusId = StatusList.Where(t => t.Name == "Pre-market").FirstOrDefault().Id;
                    }
                    // if (property.HomeType == "open home") {
                    // 	propertyDetail.Day = property.Day;
                    // 	propertyDetail.Time = property.Time;
                    // 	propertyDetail.Status = "Open home / Owner active";
                    // 	propertyDetail.StatusId = 3;
                    // }
                    propertyDetail.IsShowAskingPrice = property.IsShowAskingPrice;
                    var result = _propertyDetailService.CheckInsertOrUpdate(propertyDetail, false);
                    if (isUpdateOpenHomeFirstTime == true)
                    {
                        var prpertyNotifyProperties = _propertyNotifyService.GetAllPropertyNotifyByDetailId(propertyDetail.Id);
                        var properycrudData = _propertyCrudDataService.GetMany(t => t.PropertyDetailId == propertyDetail.Id).Result.FirstOrDefault();
                        foreach (var item in prpertyNotifyProperties)
                        {
                            PropertyNotifyVM propertyNotify = new PropertyNotifyVM();
                            propertyNotify.PropertyDetailId = propertyDetail.Id;
                            propertyNotify.UserId = item.UserId;
                            propertyNotify.OpenedDate = propertyDetail.OpenedDate.Value;
                            propertyNotify.Day = propertyDetail.Day;
                            propertyNotify.Time = propertyDetail.Time;
                            propertyNotify.Address = properycrudData.Address;
                            var sendNotificationMail = await propertyNotifyMail.SentNotifyEmail(propertyNotify);
                        }
                    }

                    var data = _propertyCrudDataService.GetMany(t => t.PropertyDetailId == property.PropertyDetailId).Result.FirstOrDefault();
                    data.HomebuzzEstimate = property.HomebuzzEstimate;
                    data.Bedrooms = property.Bedrooms;
                    data.Bathrooms = property.Bathrooms;
                    data.CarSpace = property.CarSpace;
                    data.Landarea = property.Landarea;
                    data.AskingPrice = property.AskingPrice;
                    var AddOrUpdate = _propertyCrudDataService.CheckInsertOrUpdate(data);
                    return AddOrUpdate;
                }
                else
                {
                    return propertyCrudData;
                }
            }
            catch (Exception ex)
            {
                return propertyCrudData;
            }
        }

        //Get property details on full address search
        public async Task<List<Property>> SearchPropertyCrudData(SearchVM searchVM)
        {
            List<Property> lstProperty = new List<Property>();

            lstProperty = _propertyCrudDataService.GetAllProperties(searchVM);

            return lstProperty;
        }

        public async Task<List<Property>> SearchPropertyView(SearchVM searchVM)
        {
            List<Property> lstProperty = new List<Property>();

            lstProperty = _propertyViewService.GetAllPropertiesViews(searchVM);

            return lstProperty;
        }

        public async Task<List<Property>> GetSubHurbSimilarProperties(SearchVM searchVM)
        {
            List<Property> lstProperty = new List<Property>();

            lstProperty = _propertyCrudDataService.GetSubHurbSimilarProperties(searchVM);

            return lstProperty;
        }

        public async Task<List<RankedPropertyVM>> GetRankedProperties(SearchVM searchVM)
        {
            List<RankedPropertyVM> lstBuzzProperty = new List<RankedPropertyVM>();

            lstBuzzProperty = _propertyCrudDataService.GetRankedProperties(searchVM);

            return lstBuzzProperty;
        }

         public async Task<List<Property>> GetLast90View(SearchVM searchVM)
        {
            List<Property> lstBuzzProperty = new List<Property>();

            lstBuzzProperty = _propertyCrudDataService.GetLast90View(searchVM);

            return lstBuzzProperty;
        }

         public async Task<List<RankedPropertyVM>> GetViewerStrength(SearchVM searchVM)
        {
            List<RankedPropertyVM> lstBuzzProperty = new List<RankedPropertyVM>();

            lstBuzzProperty = _propertyCrudDataService.GetViewerStrength(searchVM);

            return lstBuzzProperty;
        }

        // Bhavesh Ladva
        public async Task<List<RankedPropertyVM>> GetBuzzingProperties(SearchVM searchVM)
        {
            List<RankedPropertyVM> lstBuzzProperty = new List<RankedPropertyVM>();

            lstBuzzProperty = _propertyCrudDataService.GetBuzzProperty(searchVM);

            return lstBuzzProperty;
        }
    }
}
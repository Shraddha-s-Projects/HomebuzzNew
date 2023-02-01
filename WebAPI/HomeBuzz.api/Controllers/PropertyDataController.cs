using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.BusinessLogic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/PropertyData")]
    public class PropertyDataController : Controller {
        private readonly IPropertyDataService _propertyDataService;
        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyLikeService _propertyLikeService;
        private readonly IPropertyOfferService _propertyOfferService;
        private IPropertyRepository _propertyRepository;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IPropertyImageService _propertyImageService;

        private ErrorLogService errorlogservice;
        private readonly IHostingEnvironment _hostingEnvironment;
        private PropertySearch propertySearch;
        private readonly IPropertyStatusService _propertyStatusService;
        private readonly IUserService _userService;
        private readonly IEmailTemplateService _emailTemplateService;
        private IPropertyNotifyService _propertyNotifyService;

        #region 'Constructor'
        public PropertyDataController (IPropertyDataService propertyDataService, IPropertyDetailService propertyDetailService, IPropertyCrudDataService propertyCrudDataService,
            IPropertyViewService propertyViewService, IPropertyImageService propertyImageService, IPropertyLikeService propertyLikeService, IPropertyOfferService propertyOfferService, HomeBuzzContext context, IPropertyRepository propertyRepository, IHostingEnvironment hostingEnvironment,
            IPropertyStatusService propertyStatusService,
            IUserService userService,
            IEmailTemplateService emailTemplateService,
            IPropertyNotifyService propertyNotifyService) {
            _propertyDataService = propertyDataService;
            _propertyDetailService = propertyDetailService;
            _propertyLikeService = propertyLikeService;
            _propertyOfferService = propertyOfferService;
            _propertyViewService = propertyViewService;
            errorlogservice = new ErrorLogService (context);
            _propertyImageService = propertyImageService;
            _hostingEnvironment = hostingEnvironment;
            _propertyStatusService = propertyStatusService;
            _userService = userService;
            _emailTemplateService = emailTemplateService;
            _propertyNotifyService = propertyNotifyService;
            propertySearch = new PropertySearch (propertyDataService, propertyDetailService, propertyLikeService, propertyRepository, propertyCrudDataService, propertyViewService, propertyImageService, propertyStatusService,
                userService, emailTemplateService, propertyNotifyService, context);
        }
        #endregion

        #region 'Property Data'
        /// <summary>
        /// This API called to get all property data.
        /// </summary>
        /// <returns></returns>

        //GET: api/PropertyData/GetAll
        //GET: api/PropertyData/GetAll?searchTerm=
        [AllowAnonymous]
        [HttpPost ("GetAll")]
        public async Task<OperationResult<List<Property>>> GetAllPropertyData ([FromBody] SearchVM searchVM) {
            try {
                ////get all property data
                //var resultData = _propertyDataService.GetAllPropertyData(searchTerm);

                ////get details of each from prop details
                //var resultDetails = _propertyDetailService.GetAllPropertyDetails(resultData.ToList().Select(p => p.Id).ToList());

                ////insert data to propertydetail table

                //var Ids = resultData.Where(i => !resultDetails.Select(m => m.PropertyId).Contains(i.Id)).Select(t => t.Id).ToList();

                //if (Ids.Count > 0)
                //{
                //    foreach (var id in Ids)
                //    {
                //        PropertyDetail obj = new PropertyDetail();
                //        obj.PropertyId = id;
                //        obj.Status = "Open / Owner Active";
                //        obj.IsClaimed = false;
                //        obj.IsActive = true;
                //        obj.ActivatedDate = DateTime.UtcNow;
                //        var result = _propertyDetailService.CheckInsertOrUpdate(obj);
                //    }
                //}

                ////get details of each from prop details
                //var resultLikes = _propertyLikeService.GetAllPropertyLikes(resultDetails.ToList().Select(p => p.Id).ToList());

                ////get details of each from prop details
                //var resultOffers = _propertyOfferService.GetAllPropertyOffers(resultDetails.ToList().Select(p => p.Id).ToList());

                ////get VM ready - data, details and like table queries
                //var query = (from propertyData in resultData
                //             join propertyDetail in resultDetails on propertyData.Id equals propertyDetail.PropertyId
                //             //properties user liked
                //             join propertylike in resultLikes on propertyDetail.Id equals propertylike.PropertyDetailsId into property_like_joined
                //             from property_like in property_like_joined.DefaultIfEmpty()
                //             from propertylike in resultLikes.Where(var_like => property_like == null ? false : var_like.PropertyDetailsId == property_like.PropertyDetailsId).DefaultIfEmpty()
                //                 //properties offers user made
                //             join propertyoffer in resultOffers on propertyDetail.Id equals propertyoffer.PropertyDetailsId into property_offer_joined
                //             from property_offer in property_offer_joined.DefaultIfEmpty()
                //             from propertyoffer in resultOffers.Where(var_offer => property_offer == null ? false : var_offer.PropertyDetailsId == property_offer.PropertyDetailsId).DefaultIfEmpty()
                //                 //where - based on selected options
                //             where propertyDetail.ActivatedDate > DateTime.Now.AddDays(period * -1)
                //             //order by id
                //             orderby propertyData.Id ascending
                //             //prepare VM with all the details
                //             select new Property
                //             {
                //                 Id = propertyData.Id,
                //                 PropertyDetailId = propertyDetail.Id,
                //                 Address = propertyData.Address,
                //                 HomebuzzEstimate = propertyData.HomebuzzEstimate == null ? 0 : propertyData.HomebuzzEstimate.Value,
                //                 Bedrooms = propertyData.Bedrooms,
                //                 Bathrooms = propertyData.Bathrooms,
                //                 CarSpace = propertyData.CarSpace,
                //                 Landarea = propertyData.Landarea,
                //                 IsActive = propertyDetail.IsActive,
                //                 IsClaimed = propertyDetail.IsClaimed,
                //                 ViewCount = propertyDetail.ViewCount,
                //                 OwnerId = propertyDetail.OwnerId,
                //                 Status = propertyDetail.Status,
                //                 LatitudeLongitude = propertyData.LatitudeLongitude,
                //                 UserLiked = propertylike == null ? false : true,
                //                 UserOffered = propertyoffer == null ? false : true
                //             }).ToList();

                List<Property> query = propertySearch.SearchProperty (searchVM).Result;
                return new OperationResult<List<Property>> (true, "", query);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<Property>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        // Bhavesh Ladva
        [AllowAnonymous]
        [HttpPost ("RankedProperty")]
        public async Task<OperationResult<List<RankedPropertyVM>>> GetBuzzPropertyList ([FromBody] SearchVM searchVM) {
            try {
                if (searchVM.IsSurroundingSuburb) {
                    searchVM.SearchTerm = null;
                }
                List<RankedPropertyVM> query = propertySearch.GetBuzzingProperties (searchVM).Result;
                return new OperationResult<List<RankedPropertyVM>> (true, "", query);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<RankedPropertyVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("PropertyRank")]
        public async Task<OperationResult<List<RankedPropertyVM>>> PropertyRank ([FromBody] SearchVM searchVM) {
            try {

                List<RankedPropertyVM> query = propertySearch.GetRankedProperties (searchVM).Result;
                return new OperationResult<List<RankedPropertyVM>> (true, "", query);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<RankedPropertyVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("GetLast90View")]
        public async Task<OperationResult<List<Property>>> GetLast90View ([FromBody] SearchVM searchVM) {
            try {
                List<Property> query = propertySearch.GetLast90View (searchVM).Result;
                return new OperationResult<List<Property>> (true, "", query);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<Property>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("GetViewerStrength")]
        public async Task<OperationResult<List<RankedPropertyVM>>> GetViewerStrength ([FromBody] SearchVM searchVM) {
            try {

                List<RankedPropertyVM> query = propertySearch.GetViewerStrength (searchVM).Result;
                return new OperationResult<List<RankedPropertyVM>> (true, "", query);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<RankedPropertyVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("GetSubHurbPropertyInfo")]
        public async Task<OperationResult<SubHurbPropertyInfo>> GetSubHurbPropertyInfo ([FromBody] SearchVM searchVM) {
            try {
                SubHurbPropertyInfo query = _propertyDataService.GetSubHurbPropertyInfo (searchVM);
                return new OperationResult<SubHurbPropertyInfo> (true, "", query);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<SubHurbPropertyInfo> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("AddUpdatePropertyCrudData")]
        public async Task<OperationResult<PropertyCrudData>> AddUpdatePropertyCrudData ([FromBody] Property model) {
            try {
                var propertyObj = propertySearch.UpdateProperty (model);
                var propertyDetailObj = _propertyDetailService.GetPropertyDetailById (model.PropertyDetailId);
                if (propertyDetailObj != null) {
                    var existingPropertyData = _propertyDataService.GetPropertyDataById (propertyDetailObj.PropertyId.Value);
                    if (existingPropertyData != null) {
                        if (string.IsNullOrEmpty (existingPropertyData.Bedrooms) || existingPropertyData.Bedrooms == "-") {
                            existingPropertyData.Bedrooms = model.Bedrooms;
                        }
                        if (string.IsNullOrEmpty (existingPropertyData.Bathrooms) || existingPropertyData.Bathrooms == "-") {
                            existingPropertyData.Bathrooms = model.Bathrooms;
                        }
                        if (string.IsNullOrEmpty (existingPropertyData.CarSpace) || existingPropertyData.CarSpace == "-") {
                            existingPropertyData.CarSpace = model.CarSpace;
                        }
                        if (string.IsNullOrEmpty (existingPropertyData.Landarea) || existingPropertyData.Landarea == "-") {
                            existingPropertyData.Landarea = model.Landarea;
                        }
                        var resultPropertyData = _propertyDataService.UpdateAsync (existingPropertyData, propertyDetailObj.PropertyId.Value);
                        var resultPropertyDataSave = _propertyDataService.SaveAsync ();
                    }
                }
                return new OperationResult<PropertyCrudData> (true, "", propertyObj.Result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertyCrudData> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [AllowAnonymous]
        [HttpPost ("GooglemapToImage")]
        public async Task<OperationResult<PropertyData>> GooglemapToImage ([FromBody] ImageModel model) {
            try {
                string filedir = _hostingEnvironment.WebRootPath + "\\Upload\\GoogleImages";
                if (!Directory.Exists (filedir)) {
                    Directory.CreateDirectory (filedir);
                }

                var fileName = "googleImage-" + model.propertyId + ".jpg";
                var filePath = filedir + "\\" + fileName;

                using (FileStream fs = new FileStream (filePath, FileMode.Create)) {
                    using (BinaryWriter bw = new BinaryWriter (fs))

                    {
                        byte[] data = Convert.FromBase64String (model.imageData);
                        bw.Write (data);
                        bw.Close ();
                    }
                }
                var existingpropertyData = _propertyDataService.GetPropertyDataById (Convert.ToInt32 (model.propertyId));
                if (existingpropertyData != null && existingpropertyData.GoogleImage == null) {
                    existingpropertyData.GoogleImage = fileName;
                    var resultPropertyData = _propertyDataService.UpdateAsync (existingpropertyData, Convert.ToInt32 (model.propertyId));
                    var resultPropertyDataSave = _propertyDataService.SaveAsync ();
                }

                return new OperationResult<PropertyData> (true, "", existingpropertyData);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertyData> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route ("GetGoogleImage")]
        public FileResult GetGoogleImage (int propertyId) {
            try {
                var existingpropertyData = _propertyDataService.GetPropertyDataById (propertyId);
                // full path to file in temp location
                var dirPath = _hostingEnvironment.WebRootPath + "\\Upload\\GoogleImages";
                var filePath = dirPath + "\\" + "default.png";

                if (existingpropertyData != null && !string.IsNullOrEmpty (existingpropertyData.GoogleImage)) {
                    filePath = dirPath + "\\" + existingpropertyData.GoogleImage;
                    if (Path.GetExtension (existingpropertyData.GoogleImage).ToUpper () == ".JPG" ||
                        Path.GetExtension (existingpropertyData.GoogleImage).ToUpper () == ".JPEG") {
                        Byte[] b = System.IO.File.ReadAllBytes (filePath);
                        return File (b, "image/jpeg");
                    }

                    if (Path.GetExtension (existingpropertyData.GoogleImage).ToUpper () == ".PNG") {
                        Byte[] b = System.IO.File.ReadAllBytes (filePath);
                        return File (b, "image/png");
                    }
                    return null;

                } else {
                    return null;
                }
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return null;
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route ("IsExistGoogleImage")]
        public Boolean IsExistGoogleImage (int PropertyId) {
            var dirPath = _hostingEnvironment.WebRootPath + "\\Upload\\GoogleImages";
            var existingpropertyData = _propertyDataService.GetPropertyDataById (PropertyId);
            if (existingpropertyData != null && !string.IsNullOrEmpty (existingpropertyData.GoogleImage)) {
                var filePath = dirPath + "\\" + existingpropertyData.GoogleImage;
                if (!Directory.Exists (dirPath)) {
                    return false;
                } else {
                    if (!System.IO.File.Exists (filePath)) {
                        return false;
                    } else {
                        return true;
                    }

                }
            } else {
                return false;
            }

        }

        public FileResult GetFileFromBytes (byte[] bytesIn) {
            return File (bytesIn, "image/png");
        }
        #endregion

        public class ImageModel {
            public string propertyId { get; set; }
            public string imageData { get; set; }
        }
    }
}
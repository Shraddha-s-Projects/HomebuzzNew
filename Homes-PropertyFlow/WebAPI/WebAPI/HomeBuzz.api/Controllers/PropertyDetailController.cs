using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeBuzz.api.Controllers {
	[Produces ("application/json")]
	[Route ("api/PropertyDetail")]
	public class PropertyDetailController : Controller {
		private readonly IPropertyDetailService _propertyDetailService;

		private ErrorLogService errorlogservice;

		private readonly IHostingEnvironment _hostingEnvironment;

		private readonly IPropertyImageService _propertyImageService;
		private readonly IPropertyCrudDataService _propertyCrudDataService;
		private readonly IPropertyLikeService _propertyLikeService;
		private readonly IPropertyOfferService _propertyOfferService;
		private readonly IPropertyViewService _propertyViewService;
		private readonly IPropertyDataService _propertyDataService;
		private readonly IPropertyClaimService _propertyClaimService;
		private readonly IPropertyAgentService _propertAgentService;

		#region 'Constructor'
		public PropertyDetailController (IPropertyDetailService propertyDetailService,
			HomeBuzzContext context,
			IHostingEnvironment hostingEnvironment,
			IPropertyImageService propertyImageService,
			IPropertyViewService propertyViewService,
			IPropertyLikeService propertyLikeService,
			IPropertyOfferService propertyOfferService,
			IPropertyCrudDataService propertyCrudDataService,
			IPropertyDataService propertyDataService,
			IPropertyAgentService propertyAgentService,
			IPropertyClaimService propertyClaimService) {
			_propertyDetailService = propertyDetailService;
			_hostingEnvironment = hostingEnvironment;
			_propertyImageService = propertyImageService;
			_propertyCrudDataService = propertyCrudDataService;
			_propertyLikeService = propertyLikeService;
			_propertyOfferService = propertyOfferService;
			_propertyViewService = propertyViewService;
			_propertyClaimService = propertyClaimService;
			_propertAgentService = propertyAgentService;
			_propertyDataService = propertyDataService;
			errorlogservice = new ErrorLogService (context);
		}
		#endregion

		#region 'Property Detail'
		/// <summary>
		/// This API called to get all property data.
		/// </summary>
		/// <returns></returns>

		//GET: api/PropertyDetail/GetAll
		[AllowAnonymous]
		[HttpGet ("GetAll")]
		public async Task<OperationResult<List<PropertyDetail>>> GetAllPropertyDetail () {
			try {
				var result = _propertyDetailService.GetAllProperty ();

				return new OperationResult<List<PropertyDetail>> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<PropertyDetail>> (false, CommonMessage.DefaultErrorMessage);
			}
		}
		#endregion

		#region 'add/update view count of property'
		/// <summary>
		/// This API called when user do sign up.
		/// </summary>
		/// <param name="Model"> User Model</param>
		/// <returns></returns>
		[AllowAnonymous]
		[HttpPost ("AddUpdateProperty")]
		public async Task<OperationResult<PropertyDetail>> AddUpdate ([FromBody] PropertyDetail Model) {
			try {
				// Model.Status = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(Model.Status.ToLower());
				var result = _propertyDetailService.CheckInsertOrUpdate (Model, true);

				return new OperationResult<PropertyDetail> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyDetail> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		#region 'update Description of propertydetail'
		/// <summary>
		/// This API called when user do sign up.
		/// </summary>
		/// <param name="PropertyDetailId"> User Model</param>
		/// <returns></returns>
		[Authorize]
		[HttpPost ("UpdateDescription")]
		public async Task<OperationResult<PropertyDetail>> UpdateDescription ([FromBody] PropertyDetail Model) {
			try {
				var propertyDetail = _propertyDetailService.GetMany (t => t.Id == Model.Id).Result.FirstOrDefault ();
				propertyDetail.Description = Model.Description;
				var result = _propertyDetailService.CheckInsertOrUpdate (propertyDetail, false);

				return new OperationResult<PropertyDetail> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyDetail> (false, CommonMessage.DefaultErrorMessage);
			}
		}
		#endregion

		[Authorize]
		[HttpPost ("UpdateAgentOption")]
		public async Task<OperationResult<PropertyAgentVM>> UpdateAgentOption ([FromBody] PropertyAgentVM Model) {
			try {
				// var propertyDetail = _propertyDetailService.GetMany (t => t.Id == Model.PropertyDetailId.Value).Result.FirstOrDefault ();
				// propertyDetail.AgentOption = Model.AgentOptionId;
				// var result = _propertyDetailService.CheckInsertOrUpdate (propertyDetail, false);
				var IsExistListProperty = false;
				if (Model.AgentOptionId == 1) {
					IsExistListProperty = _propertAgentService.IsListProerty (Model.PropertyDetailId.Value);
				}
				if (!IsExistListProperty) {
					PropertyAgent PropertyAgentObj = new PropertyAgent ();
					PropertyAgentObj.OwnerId = Convert.ToInt64 (Model.OwnerId);
					PropertyAgentObj.PropertyDetailId = Model.PropertyDetailId;
					PropertyAgentObj.AgentOptionId = Model.AgentOptionId;
					var PropertyAgent = _propertAgentService.CheckInsertOrUpdate (PropertyAgentObj);
					Model.Id = PropertyAgent.Id;
					Model.IsListProperty = _propertAgentService.IsListProerty (Model.PropertyDetailId.Value);
					return new OperationResult<PropertyAgentVM> (true, "", Model);
				} else {
					return new OperationResult<PropertyAgentVM> (false, CommonMessage.AlReadyListProperty);
				}

			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyAgentVM> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[HttpPost]
		[Route ("UploadFiles")]
		public async Task<OperationResult<List<PropertyImage>>> UploadFiles (IFormFile[] fileList, int PropertDetailId) {
			PropertyImage AddOrUpdate = new PropertyImage ();
			List<PropertyImage> PropImageList = new List<PropertyImage> ();
			try {
				if (fileList == null) throw new Exception ("File is null");
				if (fileList.Length == 0) throw new Exception ("File is empty");

				foreach (IFormFile file in fileList) {
					// full path to file in temp location
					var dirPath = _hostingEnvironment.WebRootPath + "\\Upload";

					if (!Directory.Exists (dirPath)) {
						Directory.CreateDirectory (dirPath);
					}

					var fileName = string.Concat (
						Path.GetFileNameWithoutExtension (file.FileName),
						DateTime.Now.ToString ("yyyyMMdd_HHmmss"),
						Path.GetExtension (file.FileName)
					);
					var filePath = dirPath + "\\" + fileName;

					using (var oStream = new FileStream (filePath, FileMode.Create, FileAccess.ReadWrite)) {
						await file.CopyToAsync (oStream);
					}

					PropertyImage propertyImage = new PropertyImage ();
					propertyImage.ImageName = fileName;
					propertyImage.PropertyDetailId = PropertDetailId;
					PropImageList.Add (propertyImage);
					AddOrUpdate = _propertyImageService.CheckInsertOrUpdate (propertyImage);
				}
				return new OperationResult<List<PropertyImage>> (true, "", PropImageList);

			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<PropertyImage>> (false, CommonMessage.DefaultErrorMessage);
			}
		}
		#endregion

		[HttpGet]
		[AllowAnonymous]
		[Route ("PropertyImages")]
		public FileResult PropertyImages (int ImageId) {
			try {
				var PropertyImage = _propertyImageService.GetImageById (ImageId);

				// full path to file in temp location
				var dirPath = _hostingEnvironment.WebRootPath + "\\Upload";
				var filePath = dirPath + "\\" + "default.png";

				if (PropertyImage != null && !string.IsNullOrEmpty (PropertyImage.ImageName)) {
					filePath = dirPath + "\\" + PropertyImage.ImageName;
					if (Path.GetExtension (PropertyImage.ImageName).ToUpper () == ".JPG" ||
						Path.GetExtension (PropertyImage.ImageName).ToUpper () == ".JPEG") {
						Byte[] b = System.IO.File.ReadAllBytes (filePath);
						return File (b, "image/jpeg");
					}

					if (Path.GetExtension (PropertyImage.ImageName).ToUpper () == ".PNG") {
						Byte[] b = System.IO.File.ReadAllBytes (filePath);
						return File (b, "image/png");
					}
				}
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
			}
			var dPath = _hostingEnvironment.WebRootPath + "\\Upload";
			var fPath = dPath + "\\" + "default.png";
			Byte[] byteArr = System.IO.File.ReadAllBytes (fPath);
			return File (byteArr, "image/png");
		}

		[Authorize]
		[HttpPost ("DeletePropertyImage")]
		public async Task<OperationResult<PropertyImage>> DeletePropertyImage (int PropertyImageId) {
			try {
				var propertyImageModel = _propertyImageService.GetMany (t => t.Id == PropertyImageId).Result.FirstOrDefault ();

				var dirPath = _hostingEnvironment.WebRootPath + "\\" + "Upload";
				var filePath = dirPath + "\\" + propertyImageModel.ImageName;

				if (System.IO.File.Exists (filePath)) {
					System.IO.File.Delete (Path.Combine (filePath));
				}

				var result = _propertyImageService.RemovePropertyImage (propertyImageModel);

				return new OperationResult<PropertyImage> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyImage> (false, CommonMessage.DefaultErrorMessage);

			}
		}

		[AllowAnonymous]
		[HttpPost ("GetPropertyDetail")]
		public async Task<OperationResult<Property>> GetPropertyDetail ([FromBody] SearchVM searchVM) {
			try {
				Property prop = new Property ();

				prop = _propertyDetailService.GetPropertyDetail (searchVM.PropertyDetailId.Value, searchVM.UserId);
				if (prop.ImageIds != null) {
					prop.ImageIdList = prop.ImageIds.Split (",");
				}
				prop.PropertyLikes = _propertyLikeService.GetMany (t => t.PropertyDetailId == searchVM.PropertyDetailId.Value).Result.ToList ();
				prop.PropertyOffers = _propertyOfferService.GetMany (t => t.PropertyDetailId == searchVM.PropertyDetailId.Value).Result.ToList ();
				prop.PropertyClaim = _propertyClaimService.GetMany (t => t.PropertyDetailId == searchVM.PropertyDetailId.Value).Result.FirstOrDefault ();
				prop.PropertyData = _propertyDataService.GetMany (t => t.Id == prop.PropertyId).Result.FirstOrDefault ();
				prop.PropertyView = _propertyViewService.GetMany (t => t.PropertyDetailId == searchVM.PropertyDetailId.Value).Result.ToList ();
				if (prop != null) {
					SearchPropertyViewModel model = new SearchPropertyViewModel ();
					model.UserId = searchVM.UserId;
					model.PropertydetailIds = searchVM.PropertyDetailId.Value.ToString();
					model.UserKey = searchVM.UserKey;
					var propertyViewList = _propertyCrudDataService.GetPropertyViewBasedOnDetailId (model);
				
						var propertyviewCollection = propertyViewList.Where (t => t.PropertyDetailId == prop.PropertyDetailId);
						var today = DateTime.Today;
						// Console.Write ("today", today.ToString ());
						var ActivatedDate = prop.ActivatedDate.Date.AddHours (00).AddMinutes (00).AddSeconds (00);
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
								prop.IsViewedInWeek = true;
							}
						} else if (today >= EightDays && today <= FourteenDays) {
							var duplicate = propertyviewCollection.Where (t => t.ViewDate >= EightDays && t.ViewDate <= FourteenDays).Count ();
							if (duplicate > 0) {
								prop.IsViewedInWeek = true;
							}
						} else if (today >= FifteenDays && today <= TwentyOneDays) {
							var duplicate = propertyviewCollection.Where (t => t.ViewDate >= FifteenDays && t.ViewDate <= TwentyOneDays).Count ();
							if (duplicate > 0) {
								prop.IsViewedInWeek = true;
							}
						} else if (today >= TwentyTwoDays && today <= TwentyEightDays) {
							var duplicate = propertyviewCollection.Where (t => t.ViewDate >= TwentyTwoDays && t.ViewDate <= TwentyEightDays).Count ();
							if (duplicate > 0) {
								prop.IsViewedInWeek = true;
							}
						}
				}
				return new OperationResult<Property> (true, "", prop);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<Property> (false, CommonMessage.DefaultErrorMessage);
			}
		}
	}
}
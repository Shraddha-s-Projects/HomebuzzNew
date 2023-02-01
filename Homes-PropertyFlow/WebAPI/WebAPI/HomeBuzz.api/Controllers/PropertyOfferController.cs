using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeBuzz.api.Controllers {
	[Produces ("application/json")]
	[Route ("api/PropertyOffer")]
	public class PropertyOfferController : Controller {
		private readonly IPropertyOfferService _propertyOfferService;
		private readonly IPropertyDetailService _propertyDetailService;
		private readonly IPropertyDataService _propertyDataService;
		private readonly IPropertyCrudDataService _propertyCrudDataService;
		private PropertyOfferMail propertyOfferMail;
		private readonly IPropertyClaimService _propertyClaimService;
		private readonly IUserService _userService;

		private ErrorLogService errorlogservice;

		#region 'Constructor'
		public PropertyOfferController (IPropertyOfferService propertyOfferService, IUserService userService, HomeBuzzContext context, IPropertyDetailService propertyDetailService,
			IPropertyDataService propertyDataService, IPropertyCrudDataService propertyCrudDataService, IEmailTemplateService emailTemplateService,
			IPropertyClaimService propertyClaimService) {
			_propertyOfferService = propertyOfferService;
			_propertyDetailService = propertyDetailService;
			_propertyDataService = propertyDataService;
			_propertyCrudDataService = propertyCrudDataService;
			_propertyClaimService = propertyClaimService;
			propertyOfferMail = new PropertyOfferMail (userService, emailTemplateService, context);
			errorlogservice = new ErrorLogService (context);
		}
		#endregion

		#region 'Property Offer'
		/// <summary>
		/// This API called when user do sign up.
		/// </summary>
		/// <param name="Model"> User Model</param>
		/// <returns></returns>
		[Authorize]
		[HttpPost ("MakeOffer")]
		public async Task<OperationResult<PropertyOffer>> AddUpdate ([FromBody] PropertyOfferVM Model) {
			try {

				PropertyOffer propertyOffer = new PropertyOffer ();
				propertyOffer.OfferingAmount = Model.OfferingAmount;
				propertyOffer.PropertyDetailId = Model.PropertyDetailId.Value;
				propertyOffer.UserId = Model.UserId.Value;
				var result = _propertyOfferService.CheckInsertOrUpdate (propertyOffer);
				var result1 = await propertyOfferMail.MakeOfferMail (Model);
				var propertyClaim = _propertyClaimService.GetPropertyClaimByPropertyDetailId (Model.PropertyDetailId.Value);
				if (propertyClaim != null) {
					PropertyClaimVM propertyClaimVM = new PropertyClaimVM ();
					propertyClaimVM.Address = Model.Address;
					propertyClaimVM.OwnerId = propertyClaim.OwnerId.Value;
					var claimMail = await propertyOfferMail.SendSingleOfferMailToSeller (propertyClaimVM);
				}

				return new OperationResult<PropertyOffer> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyOffer> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("UpdateStatus")]
		public async Task<OperationResult<PropertyOffer>> UpdateStatus ([FromBody] PropertyOfferVM Model) {
			try {
				var propertyOffer = _propertyOfferService.GetPropertyOfferById (Model.Id);
				propertyOffer.Status = Model.Status;
				var result = _propertyOfferService.CheckInsertOrUpdate (propertyOffer);
				Model.UserId = result.UserId.Value;
				var result1 = await propertyOfferMail.NegotiateOfferMail (Model);
				return new OperationResult<PropertyOffer> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyOffer> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("UserOffers")]
		public async Task<OperationResult<List<UserPropertyOffer>>> GetUserOffers (int userId) {
			try {
				var result = _propertyOfferService.GetUserPropertyOffers (userId);
				return new OperationResult<List<UserPropertyOffer>> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<UserPropertyOffer>> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("DeleteUserOffer")]
		public async Task<OperationResult<PropertyOffer>> DeleteUserOffer (int OfferId) {
			try {
				var propertyOffer = _propertyOfferService.GetMany (t => t.Id == OfferId).Result.FirstOrDefault ();
				var result = _propertyOfferService.RemovePropertyOffer (propertyOffer);
				var address = _propertyCrudDataService.GetPropertyCrudDataByPropertyDetailId (propertyOffer.PropertyDetailId.Value).Address;
				PropertyOfferVM Model = new PropertyOfferVM ();
				Model.UserId = propertyOffer.UserId;
				Model.Address = address;
				Model.OfferingAmount = propertyOffer.OfferingAmount;
				var result1 = await propertyOfferMail.RemoveOfferMail (Model);
				return new OperationResult<PropertyOffer> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyOffer> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpGet ("GetPropertyOfferById")]
		public OperationResult<PropertyOffer> GetPropertyOfferById (int OfferId) {
			try {
				var propertyOffer = _propertyOfferService.GetPropertyOfferById (OfferId);
				return new OperationResult<PropertyOffer> (true, "", propertyOffer);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyOffer> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpGet ("GetPropertyOffersByDetailId")]
		public async Task<OperationResult<List<UserPropertyOffer>>> GetPropertyOffersByDetailId (int PropertyDetailId) {
			try {
				var result = _propertyOfferService.GetAllOffersByPropertyDetailId (PropertyDetailId);
				return new OperationResult<List<UserPropertyOffer>> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<UserPropertyOffer>> (false, CommonMessage.DefaultErrorMessage);
			}
		}
		#endregion
	}
}
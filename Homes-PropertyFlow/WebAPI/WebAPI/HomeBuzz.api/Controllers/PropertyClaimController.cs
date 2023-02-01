using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.helper;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using WebSocketManager;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeBuzz.api.Controllers {
	[Produces ("application/json")]
	[Route ("api/PropertyClaim")]
	[Authorize]
	public class PropertyClaimController : Controller {
		private readonly IPropertyClaimService _propertyClaimService;
		private readonly IPropertyDetailService _propertyDetailService;
		private readonly IPropertyOfferService _propertyOfferService;
		private readonly IPropertyDataService _propertyDataService;
		private readonly IPropertyCrudDataService _propertyCrudDataService;
		private SignupUser signupUser;
		private readonly IUserService _userService;
		private readonly IPropertyViewService _propertyViewService;
		private PropertyOfferMail propertyOfferMail;
		private readonly IPropertyStatusService _propertyStatusService;
		private readonly IPropertyOwnershipHistoryService _propertyOwnershipHistory;
		private readonly IPropertyActionService _propertyActionService;
		private readonly IPropertyAgentService _propertyAgentService;
		private readonly IAgentOptionService _agentOptionService;
		private readonly ICompanyService _companyService;
		private readonly IAgentPaymentService _agentPaymentService;
		private readonly IUserRolesService _userRoleService;
		private ErrorLogService errorlogservice;

		#region 'Constructor'
		public PropertyClaimController (IPropertyClaimService propertyClaimService, IPropertyDetailService propertyDetailService, HomeBuzzContext context,
			IPropertyOfferService propertyOfferService, IUserService userService, IEmailTemplateService emailTemplateService, IVerificationCodeService verificationCodeService,
			IPropertyViewService propertyViewService, IPropertyDataService propertyDataService, IPropertyCrudDataService propertyCrudDataService,
			IPropertyOwnershipHistoryService propertyOwnershipHistory,
			IAgentOptionService agentOptionService,
			IPropertyAgentService propertyAgentService,
			IPropertyActionService propertyActionService,
			IPropertyStatusService propertyStatusService,
			ICompanyService companyService,
			IAgentPaymentService agentPaymentService,
			IUserRolesService userRoleService) {
			_propertyClaimService = propertyClaimService;
			_propertyDataService = propertyDataService;
			_propertyCrudDataService = propertyCrudDataService;
			_propertyDetailService = propertyDetailService;
			_propertyOfferService = propertyOfferService;
			_propertyStatusService = propertyStatusService;
			_propertyOwnershipHistory = propertyOwnershipHistory;
			_propertyActionService = propertyActionService;
			_propertyAgentService = propertyAgentService;
			_agentOptionService = agentOptionService;
			_userService = userService;
			signupUser = new SignupUser (userService, emailTemplateService, verificationCodeService, propertyViewService, companyService, agentPaymentService, userRoleService, context);
			propertyOfferMail = new PropertyOfferMail (userService, emailTemplateService, context);
			errorlogservice = new ErrorLogService (context);
		}
		#endregion

		#region 'Property Claim'
		/// <summary>
		/// This API called when user do sign up.
		/// </summary>
		/// <param name="Model"> User Model</param>
		/// <returns></returns>
		[Authorize]
		[HttpPost ("ClaimProperty")]
		public async Task<OperationResult<PropertyClaim>> AddUpdate ([FromBody] PropertyClaimVM Model) {
			try {
				var propertyClaim = new PropertyClaim ();
				propertyClaim.PropertyDetailId = Model.PropertyDetailId.Value;
				propertyClaim.OwnerId = Model.OwnerId.Value;
				var IsExist = _propertyClaimService.GetPropertyClaimByPropertyDetailId (Model.PropertyDetailId.Value);
				if (IsExist == null) {
					var existingDetail = _propertyDetailService.GetPropertyDetailById (Model.PropertyDetailId.Value);
					var result = _propertyClaimService.CheckInsertOrUpdate (propertyClaim);

					// var userObj = _userService.GetUserByUserId (Model.OwnerId.Value);
					// if (userObj != null && userObj.RoleId == 2) {
					// 	var propertyAgent = _propertyAgentService.GetMany (t => t.PropertyDetailId == Model.PropertyDetailId && t.OwnerId == Model.OwnerId).Result.FirstOrDefault ();
					// 	if (propertyAgent != null) {
					// 		propertyAgent.AgentOptionId = 1;
					// 		_propertyAgentService.CheckInsertOrUpdate (propertyAgent);
					// 	} else {
					// 		PropertyAgent propertyAgentObj = new PropertyAgent();
					// 		propertyAgentObj.PropertyDetailId = Model.PropertyDetailId;
					// 		propertyAgentObj.OwnerId = Model.OwnerId;
					// 		propertyAgentObj.AgentOptionId = 1;
					// 		_propertyAgentService.CheckInsertOrUpdate(propertyAgentObj);
					// 	}
					// }
					var StatusList = _propertyStatusService.GetAllPropertyStatus ();

					// Insert into PropertyOwnershipHistory table when claim property
					var ActionList = _propertyActionService.GetAllPropertyAction ();
					PropertyOwnershipHistory ownershipHistory = new PropertyOwnershipHistory ();
					ownershipHistory.FromOwnerId = Model.OwnerId;
					ownershipHistory.PropertyDetailId = Model.PropertyDetailId.Value;
					ownershipHistory.PropertyId = existingDetail.PropertyId.Value;
					ownershipHistory.Action = ActionList.Where (t => t.Action == "Claim").FirstOrDefault ().Id;
					var ownerHistoryObj = _propertyOwnershipHistory.CheckInsertOrUpdate (ownershipHistory);

					existingDetail.IsClaimed = true;
					existingDetail.Status = "Pre-market";
					existingDetail.StatusId = StatusList.Where (t => t.Name == "Pre-market").FirstOrDefault ().Id;
					existingDetail.OwnerId = Model.OwnerId.Value;
					var resultDetail = _propertyDetailService.UpdateAsync (existingDetail, Model.PropertyDetailId.Value);
					var resultDetailSave = _propertyDetailService.SaveAsync ();

					var userObj = _userService.GetUserByUserId (propertyClaim.OwnerId.Value);
					// if (userObj != null && (userObj.RoleId == 2 || userObj.RoleId == 5)) {
					// 	PropertyAgent propertyAgent = new PropertyAgent ();
					// 	propertyAgent.AgentOptionId = 1;
					// 	propertyAgent.OwnerId = userObj.UserId;
					// 	propertyAgent.PropertyDetailId = existingDetail.Id;
					// 	propertyAgent.AppraisalPrice = null;
					// 	var propertyAgentObj = _propertyAgentService.CheckInsertOrUpdate(propertyAgent);
					// }

					// Send mail for Claim Home
					var result1 = await signupUser.ClaimHome (Model);
					var PropertyOfferList = _propertyOfferService.GetAllOffersByPropertyDetailId (Model.PropertyDetailId.Value).Count;
					if (PropertyOfferList > 0) {
						var offermail = await propertyOfferMail.SendMutipleOfferMailToSeller (Model);
					}
					return new OperationResult<PropertyClaim> (true, "", result);
				} else {
					return new OperationResult<PropertyClaim> (true, CommonMessage.AlReadyClaimedHome);
				}

			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyClaim> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("DeleteUserClaimProperty")]
		public async Task<OperationResult<PropertyClaim>> DeleteUserClaimProperty ([FromBody] PropertyClaimVM Model) {
			try {
				// var propertyClaim = new PropertyClaim ();
				// propertyClaim.PropertyDetailId = Model.PropertyDetailId.Value;
				// propertyClaim.OwnerId = Model.OwnerId.Value;
				// propertyClaim.Id = Model.Id;
				var existingDetail = _propertyDetailService.GetPropertyDetailById (Model.PropertyDetailId.Value);
				var StatusList = _propertyStatusService.GetMany (t => t.IsDeleted == false).Result.ToList ();
				var propertyClaim = _propertyClaimService.GetMany (t => t.PropertyDetailId == Model.PropertyDetailId).Result.FirstOrDefault ();
				Model.OwnerId = propertyClaim.OwnerId;
				Model.ClaimedOn = propertyClaim.ClaimedOn;
				var result = _propertyClaimService.RemovePropertyClaim (propertyClaim);

				// Insert into PropertyOwnershipHistory table when Unclaim property
				var ActionList = _propertyActionService.GetAllPropertyAction ();
				PropertyOwnershipHistory ownershipHistory = new PropertyOwnershipHistory ();
				ownershipHistory.FromOwnerId = Model.OwnerId;
				ownershipHistory.PropertyDetailId = Model.PropertyDetailId.Value;
				ownershipHistory.PropertyId = existingDetail.PropertyId.Value;
				ownershipHistory.Action = ActionList.Where (t => t.Action == "UnClaim").FirstOrDefault ().Id;
				var ownerHistoryObj = _propertyOwnershipHistory.CheckInsertOrUpdate (ownershipHistory);

				existingDetail.IsClaimed = false;
				existingDetail.Status = "Not listed";
				existingDetail.StatusId = StatusList.Where (t => t.Name == "Not listed").FirstOrDefault ().Id;
				existingDetail.OwnerId = null;
				existingDetail.Day = null;
				existingDetail.Time = null;
				existingDetail.IsOpenHome = false;
				existingDetail.OpenedDate = null;
				existingDetail.IsShowAskingPrice = false;
				var resultDetail = _propertyDetailService.UpdateAsync (existingDetail, Model.PropertyDetailId.Value);
				var resultDetailSave = _propertyDetailService.SaveAsync ();
				var existingPropertyCrudData = _propertyCrudDataService.GetPropertyCrudDataByPropertyDetailId (Model.PropertyDetailId.Value);
				var propertyData = _propertyDataService.GetPropertyDataById (existingDetail.PropertyId.Value);
				existingPropertyCrudData.AskingPrice = null;
				existingPropertyCrudData.HomebuzzEstimate = propertyData.HomebuzzEstimate;
				existingPropertyCrudData.Bedrooms = propertyData.Bedrooms;
				existingPropertyCrudData.Bathrooms = propertyData.Bathrooms;
				existingPropertyCrudData.CarSpace = propertyData.CarSpace;
				existingPropertyCrudData.Landarea = propertyData.Landarea;
				var resultPropertyCrudData = await _propertyCrudDataService.UpdateAsync (existingPropertyCrudData, existingPropertyCrudData.Id);
				var resultPropertyCrudDataSave = _propertyCrudDataService.SaveAsync ();
				var result1 = await signupUser.RemoveClaimHome (Model);
				return new OperationResult<PropertyClaim> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyClaim> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("RenewUserClaimProperty")]
		public async Task<OperationResult<PropertyClaim>> RenewUserClaimProperty ([FromBody] PropertyClaimVM Model) {
			try {
				var propertyClaim = _propertyClaimService.GetPropertyClaimByPropertyDetailId (Model.PropertyDetailId.Value);
				propertyClaim.ClaimedOn = DateTime.Now;
				var result = _propertyClaimService.CheckInsertOrUpdate (propertyClaim);
				var existingDetail = _propertyDetailService.GetPropertyDetailById (Model.PropertyDetailId.Value);
				existingDetail.ActivatedDate = DateTime.Now;
				var resultDetail = _propertyDetailService.CheckInsertOrUpdate (existingDetail, false);
				// Insert into PropertyOwnershipHistory table when Transfer ownership property
				var ActionList = _propertyActionService.GetAllPropertyAction ();
				PropertyOwnershipHistory ownershipHistory = new PropertyOwnershipHistory ();
				ownershipHistory.FromOwnerId = Model.OwnerId;
				ownershipHistory.PropertyDetailId = Model.PropertyDetailId.Value;
				ownershipHistory.PropertyId = existingDetail.PropertyId.Value;
				ownershipHistory.Action = ActionList.Where (t => t.Action == "Renew").FirstOrDefault ().Id;
				var ownerHistoryObj = _propertyOwnershipHistory.CheckInsertOrUpdate (ownershipHistory);

				var result1 = await signupUser.RenewClaimHome (Model);
				return new OperationResult<PropertyClaim> (true, "", propertyClaim);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyClaim> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("UserClaims")]
		public async Task<OperationResult<List<UserPropertyClaim>>> UserHomes (int userId) {
			try {
				var result = _propertyClaimService.GetUserPropertyClaims (userId);

				//var offers = _propertyOfferService.GetUserPropertyOffers (userId);

				foreach (var item in result) {
					item.Offers = new List<UserPropertyOffer> ();
					var offers = _propertyOfferService.GetAllOffersByPropertyDetailId (item.PropertyDetailId);
					foreach (var offer in offers) {
						if (item.PropertyDetailId == offer.PropertyDetailId) {
							if (item.Offers == null) {
								item.Offers = new List<UserPropertyOffer> ();
							}
							item.Offers.Add (offer);
						}
					}
				}
				return new OperationResult<List<UserPropertyClaim>> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<UserPropertyClaim>> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[Authorize]
		[HttpPost ("TransferOwnership")]
		public async Task<OperationResult<PropertyOwnershipHistoryVM>> TransferOwnership ([FromBody] PropertyOwnershipHistoryVM Model) {
			try {
				User userObj = _userService.GetUserByEmail (Model.Email);
				if (userObj != null) {
					var propertyClaim = _propertyClaimService.GetPropertyClaimByPropertyDetailId (Model.PropertyDetailId.Value);
					propertyClaim.OwnerId = userObj.UserId;
					var result = _propertyClaimService.CheckInsertOrUpdate (propertyClaim);

					// Update OwnerId into PropertyDetail Table
					var existingDetail = _propertyDetailService.GetPropertyDetailById (Model.PropertyDetailId.Value);
					existingDetail.OwnerId = userObj.UserId;
					var resultDetail = _propertyDetailService.UpdateAsync (existingDetail, Model.PropertyDetailId.Value);
					var resultDetailSave = _propertyDetailService.SaveAsync ();
					if (userObj.RoleId == 2 || userObj.RoleId == 5) {
						PropertyAgent propertyAgent = new PropertyAgent ();
						propertyAgent.OwnerId = userObj.UserId;
						propertyAgent.PropertyDetailId = Model.PropertyDetailId;
						propertyAgent.AgentOptionId = 1;
						var propertyResult = _propertyAgentService.CheckInsertOrUpdate (propertyAgent);
					}
					var removePropertyAgent = _propertyAgentService.GetMany (t => t.AgentOptionId == 1 && t.PropertyDetailId == Model.PropertyDetailId && t.OwnerId == Model.FromOwnerId).Result.FirstOrDefault ();
					if (removePropertyAgent != null) {
						_propertyAgentService.Delete (removePropertyAgent);
						await _propertyAgentService.SaveAsync ();
					}

					// Insert into PropertyOwnershipHistory table when Transfer ownership property
					var ActionList = _propertyActionService.GetAllPropertyAction ();
					PropertyOwnershipHistory ownershipHistory = new PropertyOwnershipHistory ();
					ownershipHistory.FromOwnerId = Model.FromOwnerId;
					ownershipHistory.ToOwnerId = userObj.UserId;
					ownershipHistory.PropertyDetailId = Model.PropertyDetailId.Value;
					ownershipHistory.PropertyId = existingDetail.PropertyId.Value;
					ownershipHistory.Action = ActionList.Where (t => t.Action == "TransferOwnership").FirstOrDefault ().Id;
					var ownerHistoryObj = _propertyOwnershipHistory.CheckInsertOrUpdate (ownershipHistory);
					Model.ClaimId = result.Id;
					Model.ToOwnerId = userObj.UserId;
					Model.Id = ownerHistoryObj.Id;
					var result1 = await signupUser.TransferPropertyOwner (Model);
					return new OperationResult<PropertyOwnershipHistoryVM> (true, "", Model);
				} else {
					Model.IsEmailValid = false;
					Model.EmailErrorMessage = CommonMessage.RegisteredEmail;
					return new OperationResult<PropertyOwnershipHistoryVM> (false, CommonMessage.RegisteredEmail);
				}
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyOwnershipHistoryVM> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		#endregion
	}
}
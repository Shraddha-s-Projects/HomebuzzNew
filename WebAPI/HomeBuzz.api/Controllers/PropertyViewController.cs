using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
	[Produces ("application/json")]
	// [Authorize]
	[Route ("api/PropertyView")]
	public class PropertyViewController : Controller {
		private ErrorLogService errorlogservice;
		private readonly IPropertyViewService _propertyViewService;
		private readonly IPropertyDetailService _propertyDetailService;

		#region 'Constructor'
		public PropertyViewController (
			IPropertyViewService propertyViewService,
			IPropertyDetailService propertyDetailService,
			HomeBuzzContext context
		) {
			_propertyViewService = propertyViewService;
			_propertyDetailService = propertyDetailService;
			errorlogservice = new ErrorLogService (context);
		}
		#endregion

		#region 'add/update view count of property'
		/// <summary>
		/// This API called when user do sign up.
		/// </summary>
		/// <param name="Model"> User Model</param>
		/// <returns></returns>
		// [Authorize]
		[HttpPost ("AddUpdatePropertyView")]
		public async Task<OperationResult<PropertyView>> AddUpdatePropertyView ([FromBody] PropertyViewVM Model) {
			try {
				var result = _propertyViewService.CheckInsertOrUpdate (Model);

				return new OperationResult<PropertyView> (true, "", result);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<PropertyView> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[AllowAnonymous]
		[HttpPost ("AddUpdatePropertyViewList")]
		public async Task<OperationResult<List<PropertyViewerVM>>> AddUpdatePropertyViewList ([FromBody] AddUpdateHomeCoockie Model) {
			try {
				List<PropertyViewListVM> propertyVMList = new List<PropertyViewListVM> ();
				IFormatProvider culture = new CultureInfo ("en-US", true);
				foreach (var item in Model.Homes) {
					PropertyViewListVM propertyvm = new PropertyViewListVM ();
					propertyvm.PropertyDetailId = Convert.ToInt32 (item.Id);
					propertyvm.ViewDate = DateTime.ParseExact (item.ViewDate, "mm/dd/yyyy", culture);
					propertyvm.UserId = Convert.ToInt16 (Model.UserId);
					propertyvm.UserKey = item.UserKey;
					propertyVMList.Add (propertyvm);
				}
				var result = _propertyViewService.CheckInsertOrUpdatePropertyView (propertyVMList);

				var propertyViewObj = _propertyViewService.GetPropertyViewByUserId (Model.UserId);
				var PropertyViwer = new List<PropertyViewerVM> ();
				foreach (var propView in propertyViewObj) {
					PropertyViewerVM propertyViewer = new PropertyViewerVM ();
					propertyViewer.PropertyDetailId = propView.PropertyDetailId;
					propertyViewer.ViewDate = propView.ViewDate;
					propertyViewer.UserKey = propView.UserKey;
					PropertyViwer.Add (propertyViewer);
				}
				return new OperationResult<List<PropertyViewerVM>> (true, "", PropertyViwer);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<PropertyViewerVM>> (false, CommonMessage.DefaultErrorMessage);
			}
		}

		[HttpPost ("UpdateUserIdBasedOnUserKey")]
		public async Task<OperationResult<List<PropertyView>>> UpdateUserIdBasedOnUserKey ([FromBody] UpdatePropertyViewUserIdModel Model) {
			try {
				List<PropertyViewListVM> propertyVMList = new List<PropertyViewListVM> ();
				// get propertyview list based on userkey
				var PropertyViewList = _propertyViewService.GetPropertyViewByUserKey (Model.UserKey);
				var PropertyDetailIds = "";
				var result = PropertyViewList.GroupBy (t => t.PropertyDetailId)
					.Select (grp => grp.First ())
					.ToList ();
				foreach (var item in result) {
					if (PropertyDetailIds != "") {
						PropertyDetailIds = PropertyDetailIds + ",";
					}
					PropertyDetailIds = PropertyDetailIds + item.PropertyDetailId;
				}

				SearchPropertyViewModel searchPropertyViewModel = new SearchPropertyViewModel ();
				searchPropertyViewModel.UserId = Model.UserId;
				searchPropertyViewModel.UserKey = Model.UserKey;
				searchPropertyViewModel.PropertydetailIds = PropertyDetailIds;

				// get added property view based on userid
				var addedPropertyViewList = _propertyViewService.GetPropertyViewBasedOnDetailIdUserId (searchPropertyViewModel);

				// get added propertydetailid list
				HashSet<int> diffids = new HashSet<int> (addedPropertyViewList.Select (s => s.PropertyDetailId.Value));

				// get not added property view based on detail id
				var newlyAddedPropertyViewList = PropertyViewList.Where (m => !diffids.Contains (m.PropertyDetailId.Value)).ToList ();

				// start logic for weekly view count add or remove
				foreach (var addeditem in addedPropertyViewList) {
					var remainingAddPropertyViewList = PropertyViewList.Where (t => t.PropertyDetailId == addeditem.PropertyDetailId);

					var Detail = _propertyDetailService.GetPropertyDetailById (addeditem.PropertyDetailId.Value);
					var ActivatedDate = Detail.ActivatedDate.Date.AddHours (00).AddMinutes (00).AddSeconds (00);
					var SevenDays = ActivatedDate.AddDays (7).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
					var EightDays = ActivatedDate.AddDays (8);
					var FourteenDays = ActivatedDate.AddDays (14).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
					var FifteenDays = ActivatedDate.AddDays (15);
					var TwentyOneDays = ActivatedDate.AddDays (21).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
					var TwentyTwoDays = ActivatedDate.AddDays (22);
					var TwentyEightDays = ActivatedDate.AddDays (28).Date.AddHours (23).AddMinutes (59).AddSeconds (59);
					bool addedFirstWeek = false;
					bool addedSecondWeek = false;
					bool addedThirdWeek = false;
					bool addedFourthWeek = false;
					if (addeditem.ViewDate >= ActivatedDate && addeditem.ViewDate <= SevenDays) {
						addedFirstWeek = true;
					} else if (addeditem.ViewDate >= EightDays && addeditem.ViewDate <= FourteenDays) {
						addedSecondWeek = true;
					} else if (addeditem.ViewDate >= FifteenDays && addeditem.ViewDate <= TwentyOneDays) {
						addedThirdWeek = true;
					} else if (addeditem.ViewDate >= TwentyTwoDays && addeditem.ViewDate <= TwentyEightDays) {
						addedFourthWeek = true;
					}

					foreach (var remitem in remainingAddPropertyViewList) {
						if (remitem.ViewDate >= ActivatedDate && remitem.ViewDate <= SevenDays) {
							if (addedFirstWeek == true) {
								Detail.ViewCount = Detail.ViewCount - 1;
								var deleted = _propertyViewService.RemovePropertyView (remitem);
								await _propertyDetailService.UpdateAsync (Detail, Detail.Id);
							} else {
								remitem.UserId = Model.UserId;
								await _propertyViewService.UpdateAsync (remitem, remitem.Id);
							}

						} else if (remitem.ViewDate >= EightDays && remitem.ViewDate <= FourteenDays) {

							if (addedSecondWeek == true) {
								Detail.ViewCount = Detail.ViewCount - 1;
								var deleted = _propertyViewService.RemovePropertyView (remitem);
								await _propertyDetailService.UpdateAsync (Detail, Detail.Id);	
							} else {
								remitem.UserId = Model.UserId;
								await _propertyViewService.UpdateAsync (remitem, remitem.Id);
							}
						} else if (remitem.ViewDate >= FifteenDays && remitem.ViewDate <= TwentyOneDays) {

							if (addedThirdWeek == true) {
								Detail.ViewCount = Detail.ViewCount - 1;
								var deleted = _propertyViewService.RemovePropertyView (remitem);
								await _propertyDetailService.UpdateAsync (Detail, Detail.Id);
							} else {
								remitem.UserId = Model.UserId;
								await _propertyViewService.UpdateAsync (remitem, remitem.Id);
							}
						} else if (remitem.ViewDate >= TwentyTwoDays && remitem.ViewDate <= TwentyEightDays) {

							if (addedFourthWeek == true) {
								Detail.ViewCount = Detail.ViewCount - 1;
								var deleted = _propertyViewService.RemovePropertyView (remitem);
								await _propertyDetailService.UpdateAsync (Detail, Detail.Id);
							} else {
								remitem.UserId = Model.UserId;
								await _propertyViewService.UpdateAsync (remitem, remitem.Id);
							}
						}

					}
				}
				// end logic for weekly view count add or remove

				// Newly added propertyviewd logic
				foreach (var item in newlyAddedPropertyViewList) {
					item.UserId = Model.UserId;
					await _propertyViewService.UpdateAsync (item, item.Id);
				}

				await _propertyDetailService.SaveAsync ();
				await _propertyViewService.SaveAsync ();

				return new OperationResult<List<PropertyView>> (true, "", PropertyViewList);
			} catch (Exception ex) {
				errorlogservice.LogException (ex);
				return new OperationResult<List<PropertyView>> (false, CommonMessage.DefaultErrorMessage);
			}
		}
		#endregion
	}
}
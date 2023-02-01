using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/PropertySearchHistory")]
    [Authorize]
    public class PropertySearchHistoryController : Controller {

        private readonly IPropertySearchHistoryService _propertySearchHistoryService;
        private readonly IPropertyDataService _propertyDataService;
        private ErrorLogService errorlogservice;

        #region 'Constructor'
        public PropertySearchHistoryController (IPropertySearchHistoryService propertySearchHistoryService, IPropertyDataService propertyDataService, HomeBuzzContext context) {
            _propertySearchHistoryService = propertySearchHistoryService;
            _propertyDataService = propertyDataService;
            errorlogservice = new ErrorLogService (context);
        }
        #endregion

        [AllowAnonymous]
        [HttpPost ("AddPropertySearch")]
        public async Task<OperationResult<PropertySearchHistory>> AddPropertySearch ([FromBody] PropertySearchHistoryVM Model) {
            // PropertyLike obj = new PropertyLike ();
            try {
                PropertySearchHistory propertySearch = new PropertySearchHistory ();
                if (Model.AddressType != null) {
                    if (!string.IsNullOrEmpty (Model.SearchTerm)) {
                        // foreach (var address in Model.AddressComponent) {
                        //     Model.SearchTerm = Model.SearchTerm.Replace (address.short_name, address.long_name);
                        // }
                        var a = Model.SearchTerm.Split (", New Zealand");
                        var searchTerm = a[0].Remove (a[0].Length - 5);
                        var propertyData = _propertyDataService.GetAllMasterProperties (searchTerm);
                        if (propertyData != null && propertyData.Count > 0) {
                            propertySearch.PropertyId = propertyData[0].Id;
                        } else {
                            propertySearch.PropertyId = null;
                        }
                        propertySearch.UserId = Model.UserId;
                        propertySearch.Address = Model.SearchTerm;
                        propertySearch.Bedrooms = Model.Bedrooms;
                        propertySearch.Bathrooms = Model.Bathrooms;
                        //  propertySearch.PropertyStatusId = Model.PropertyStatusId;
                        propertySearch.PropertyStatus = Model.PropertyStatus;
                        propertySearch.Address = Model.SearchTerm;
                        propertySearch.MinPrice = Model.MinPrice;
                        propertySearch.MaxPrice = Model.MaxPrice;
                        propertySearch.IsExactMatchBed = Model.IsExactMatchBed;
                        propertySearch.IsExactMatchBath = Model.IsExactMatchBath;
                        propertySearch.FromTo = Model.From + "-" + Model.To;
                        DateTime fromPeriod = DateTime.Now.AddDays (-Model.From);
                        DateTime toPeriod = DateTime.Now.AddDays (-Model.To);
                        propertySearch.FromDate = fromPeriod;
                        propertySearch.ToDate = toPeriod;
                    }
                } else {
                    propertySearch.PropertyId = null;
                    propertySearch.UserId = Model.UserId;
                    propertySearch.Address = Model.SearchTerm;
                    propertySearch.Bedrooms = Model.Bedrooms;
                    propertySearch.Bathrooms = Model.Bathrooms;
                    //    propertySearch.PropertyStatusId = Model.PropertyStatusId;
                    propertySearch.PropertyStatus = Model.PropertyStatus;
                    propertySearch.Address = Model.SearchTerm;
                    propertySearch.MinPrice = Model.MinPrice;
                    propertySearch.MaxPrice = Model.MaxPrice;
                    propertySearch.IsExactMatchBed = Model.IsExactMatchBed;
                    propertySearch.IsExactMatchBath = Model.IsExactMatchBath;
                    propertySearch.FromTo = Model.From + "-" + Model.To;
                    DateTime fromPeriod = DateTime.Now.AddDays (-Model.From);
                    DateTime toPeriod = DateTime.Now.AddDays (-Model.To);
                    propertySearch.FromDate = fromPeriod;
                    propertySearch.ToDate = toPeriod;
                }
                var result = _propertySearchHistoryService.CheckInsertOrUpdate (propertySearch);

                return new OperationResult<PropertySearchHistory> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertySearchHistory> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpPost ("GetUserPropertySearch")]
        public async Task<OperationResult<List<PropertySearchHistory>>> GetUserPropertySearch (int userId) {
            try {
                var result = _propertySearchHistoryService.GetAllPropertySearchByUser (userId);

                return new OperationResult<List<PropertySearchHistory>> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertySearchHistory>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpGet ("GetPropertySearchById")]
        public async Task<OperationResult<PropertySearchHistory>> GetPropertySearchById (int searchId) {
            try {
                var result = _propertySearchHistoryService.GetPropertySearchById (searchId);
                return new OperationResult<PropertySearchHistory> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertySearchHistory> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpPost ("RemovePropertySearchHistory")]
        public async Task<OperationResult<PropertySearchHistory>> RemovePropertySearchHistory (int SearchHistoryId) {
            try {
                var proertySearchHistory = _propertySearchHistoryService.GetMany (t => t.Id == SearchHistoryId && t.IsDeleted == false).Result.FirstOrDefault ();
                var result = _propertySearchHistoryService.RemovePropertySearchHistory (proertySearchHistory);
                return new OperationResult<PropertySearchHistory> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertySearchHistory> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}
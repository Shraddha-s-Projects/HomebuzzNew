using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [AllowAnonymous]
    [Produces ("application/json")]
    [Route ("api/[controller]")]
    public class TimeWeightedPropertyFlowInterestWeeklyController : Controller {
        private readonly ITimeWeightedPropertyFlowInterestWeeklyService _timeWeightedPropertyFlowInterestWeeklyService;
        private readonly IPropertyViewService _propertyViewService;
        private ErrorLogService errorlogservice;

        public TimeWeightedPropertyFlowInterestWeeklyController (
            ITimeWeightedPropertyFlowInterestWeeklyService timeWeightedPropertyFlowInterestWeeklyService,
            IPropertyViewService propertyViewService
        ) {
            _timeWeightedPropertyFlowInterestWeeklyService = timeWeightedPropertyFlowInterestWeeklyService;
            _propertyViewService = propertyViewService;

        }

        [HttpGet ("GetPropertyFlowInterest")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetPropertyFlowInterestByWeekly (int PropertyDetailId) {
            try {
                var TimeWeightedPropertyFlowInterestWeeklyList = _timeWeightedPropertyFlowInterestWeeklyService.GetAllTimeWeightedPropertyFlowInterestWeeklyByPropertyDetailIdLast4Weeks (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestWeeklyVMList = new List<PropertyFlowInterestVM> ();
                TimeWeightedPropertyFlowInterestWeekly TimeWeightedPropertyFlowInterestWeeklyObj = new TimeWeightedPropertyFlowInterestWeekly ();
                if (TimeWeightedPropertyFlowInterestWeeklyList.Count > 0) {
                    TimeWeightedPropertyFlowInterestWeeklyObj = TimeWeightedPropertyFlowInterestWeeklyList[0];
                }
                // var nowTime = DateTime.Today;

                DateTime date = DateTime.Today;
                if (date.DayOfWeek == DayOfWeek.Sunday) {
                    date = DateTime.Today.AddDays (-1);
                }

                while (date.DayOfWeek != DayOfWeek.Sunday) {
                    date = date.AddDays (-1);
                }

                var nowTime = date;

                if (TimeWeightedPropertyFlowInterestWeeklyList.Count >= 4) {
                    var days = 28;
                    for (int i = days; i >= 0;) {
                        var From = i;
                        var To = i - 7;
                        var fromDate = nowTime.AddDays (-From);
                        var toDate = nowTime.AddDays (-To);
                         if (toDate > nowTime) {
                            i -= 7;
                            continue;
                        }
                        toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestWeeklyVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestWeeklyVMList[length - 1];
                        }

                        var carts = TimeWeightedPropertyFlowInterestWeeklyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            var ToLocalFromDate = toDate.ToLocalTime ();
                            propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                            propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                            propertyFlowInterestVMObj.Ranking = 0;
                            propertyFlowInterestVMObj.Performance = "No flow";
                            propertyFlowInterestVMObj.CreatedOn = toDate;
                            propertyFlowInterestVMObj.RankingStatus = "No flow";
                            propertyFlowInterestVMObj.ViewCount = 0;
                            propertyFlowInterestVMObj.Time = Time;
                            PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                TimeWeightedPropertyFlowInterestWeeklyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = TimeWeightedPropertyFlowInterestWeeklyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = TimeWeightedPropertyFlowInterestWeeklyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = TimeWeightedPropertyFlowInterestWeeklyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = TimeWeightedPropertyFlowInterestWeeklyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = TimeWeightedPropertyFlowInterestWeeklyObj.ViewCount;
                                propertyFlowInterestVMObj.CreatedOn = toDate;
                                PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 7;
                    }
                }
                if (TimeWeightedPropertyFlowInterestWeeklyList.Count < 4 && TimeWeightedPropertyFlowInterestWeeklyList.Count > 0) {

                    // Days Code

                    var days = 28;
                    for (int i = days; i >= 0;) {
                        var From = i;
                        var To = i - 7;
                        var fromDate = nowTime.AddDays (-From);
                        var toDate = nowTime.AddDays (-To);
                         if (toDate > nowTime) {
                            i -= 7;
                            continue;
                        }
                        toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestWeeklyVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestWeeklyVMList[length - 1];
                        }

                        var carts = TimeWeightedPropertyFlowInterestWeeklyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                            propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                            propertyFlowInterestVMObj.Ranking = 0;
                            propertyFlowInterestVMObj.Performance = "No flow";
                            propertyFlowInterestVMObj.CreatedOn = toDate;
                            propertyFlowInterestVMObj.RankingStatus = "No flow";
                            propertyFlowInterestVMObj.ViewCount = 0;
                            propertyFlowInterestVMObj.Time = Time;
                            PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                TimeWeightedPropertyFlowInterestWeeklyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = TimeWeightedPropertyFlowInterestWeeklyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = TimeWeightedPropertyFlowInterestWeeklyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = TimeWeightedPropertyFlowInterestWeeklyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = TimeWeightedPropertyFlowInterestWeeklyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = TimeWeightedPropertyFlowInterestWeeklyObj.ViewCount;
                                propertyFlowInterestVMObj.CreatedOn = toDate;
                                PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 7;
                    }

                }
                if (TimeWeightedPropertyFlowInterestWeeklyList.Count == 0) {
                    var days = 28;
                    for (int i = days; i >= 0;) {
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                        propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                        propertyFlowInterestVMObj.Ranking = 0;
                        propertyFlowInterestVMObj.Performance = "No flow";
                        propertyFlowInterestVMObj.RankingStatus = "No flow";
                        propertyFlowInterestVMObj.ViewCount = 0;
                        var From = i;
                        var To = i - 7;
                        var fromDate = nowTime.AddDays (-From);
                        var toDate = nowTime.AddDays (-To);
                        if (toDate > nowTime) {
                            i -= 7;
                            continue;
                        }
                        toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        var ToLocalFromDate = toDate.ToLocalTime ();
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        propertyFlowInterestVMObj.Time = Time;
                        propertyFlowInterestVMObj.CreatedOn = toDate;
                        PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                        i -= 7;
                    }
                }
                return new OperationResult<List<PropertyFlowInterestVM>> (true, "", PropertyFlowInterestWeeklyVMList);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyFlowInterestVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}
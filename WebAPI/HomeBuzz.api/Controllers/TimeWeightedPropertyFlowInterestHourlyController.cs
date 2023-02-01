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
    public class TimeWeightedPropertyFlowInterestHourlyController : Controller {

        private readonly ITimeWeightedPropertyFlowInterestHourlyService _timeWeightedPropertyFlowInterestHourlyService;
        private readonly IPropertyViewService _propertyViewService;
        private ErrorLogService errorlogservice;

        public TimeWeightedPropertyFlowInterestHourlyController (
            ITimeWeightedPropertyFlowInterestHourlyService timeWeightedPropertyFlowInterestHourlyService,
            IPropertyViewService propertyViewService
        ) {
            _timeWeightedPropertyFlowInterestHourlyService = timeWeightedPropertyFlowInterestHourlyService;
            _propertyViewService = propertyViewService;
        }

        [HttpGet ("GetPropertyFlowInterest")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetTimeWeightedPropertyFlowInterestByHourly (int PropertyDetailId) {
            try {
                var TimeWeightedPropertyFlowInterestHourlyList = _timeWeightedPropertyFlowInterestHourlyService.GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast24Hours (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestHourlyVMList = new List<PropertyFlowInterestVM> ();
                TimeWeightedPropertyFlowInterestHourly PropertyFlowInterestHourlyObj = new TimeWeightedPropertyFlowInterestHourly ();
                if (TimeWeightedPropertyFlowInterestHourlyList.Count > 0) {
                    PropertyFlowInterestHourlyObj = TimeWeightedPropertyFlowInterestHourlyList[0];
                }
                var nowTime = DateTime.UtcNow;
                var Minute = nowTime.Minute;
                var Second = nowTime.Second;

                if (Minute > 0) {
                    nowTime = nowTime.AddMinutes (-Minute);
                }
                if (Second > 0) {
                    nowTime = nowTime.AddSeconds (-Second);
                }

                if (TimeWeightedPropertyFlowInterestHourlyList.Count >= 24) {

                    var hours = 24;
                    for (int i = hours; i >= 0;) {
                        var From = i;
                        var To = i - 1;
                        
                        var fromDate = nowTime.AddHours (-From).AddSeconds (0).AddMilliseconds (0);
                        var toDate = nowTime.AddHours (-From).AddMinutes (59).AddSeconds (59).AddMilliseconds (59);
                        //  var fromDate = nowTime.AddHours (-From);
                        // var toDate = nowTime.AddHours (-To);

                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestHourlyVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestHourlyVMList[length - 1];
                        }

                        var carts = TimeWeightedPropertyFlowInterestHourlyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            var ToLocalFromDate = toDate.ToLocalTime ();
                            if (previousData.ViewerStrength != "No ViewerStrength" && previousData.ViewerStrength != null) {
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = previousData.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = previousData.Ranking;
                                propertyFlowInterestVMObj.Performance = previousData.Performance;
                                propertyFlowInterestVMObj.RankingStatus = previousData.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = previousData.ViewCount;
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                propertyFlowInterestVMObj.Time = Time;
                            } else {
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                                propertyFlowInterestVMObj.Ranking = 0;
                                propertyFlowInterestVMObj.Performance = "No flow";
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                propertyFlowInterestVMObj.RankingStatus = "No flow";
                                propertyFlowInterestVMObj.ViewCount = 0;
                                propertyFlowInterestVMObj.Time = Time;
                            }
                            PropertyFlowInterestHourlyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterestHourlyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterestHourlyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterestHourlyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterestHourlyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterestHourlyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterestHourlyObj.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterestHourlyObj.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                if (PropertyFlowInterestHourlyVMList.Count > 0) {
                                    if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                        previousData.ViewerStrength = PropertyFlowInterestHourlyObj.ViewerStrength;
                                        previousData.Ranking = PropertyFlowInterestHourlyObj.Ranking;
                                        previousData.Performance = PropertyFlowInterestHourlyObj.Performance;
                                        previousData.RankingStatus = PropertyFlowInterestHourlyObj.RankingStatus;
                                        previousData.ViewCount = PropertyFlowInterestHourlyObj.ViewCount;
                                        var tempData = PropertyFlowInterestHourlyVMList[length - 1];
                                        PropertyFlowInterestHourlyVMList[length - 1] = previousData;
                                        PropertyFlowInterestHourlyVMList[length - 1].Time = tempData.Time;
                                        PropertyFlowInterestHourlyVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                    }
                                }
                                PropertyFlowInterestHourlyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }
                }
                if (TimeWeightedPropertyFlowInterestHourlyList.Count < 24 && TimeWeightedPropertyFlowInterestHourlyList.Count > 0) {

                    // Hours Code

                    var hours = 24;
                    for (int i = hours; i >= 0;) {
                        var From = i;
                        var To = i - 1;
                        var fromDate = nowTime.AddHours (-From).AddSeconds (0).AddMilliseconds (0);
                        var toDate = nowTime.AddHours (-From).AddMinutes (59).AddSeconds (59).AddMilliseconds (59);
                        //  var fromDate = nowTime.AddHours (-From);
                        // var toDate = nowTime.AddHours (-To);
                        Console.WriteLine (i);
                        Console.WriteLine (fromDate);
                        Console.WriteLine (toDate);
                        // var toDate = nowTime.AddHours (-To);
                        // var Time = toDate.ToLocalTime ().ToString ("hh:mm");
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestHourlyVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        PropertyFlowInterestVM beforePreviousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestHourlyVMList[length - 1];
                        }
                        if (length > 1) {
                            beforePreviousData = PropertyFlowInterestHourlyVMList[length - 2];
                        }
                        var carts = TimeWeightedPropertyFlowInterestHourlyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            var ToLocalFromDate = toDate.ToLocalTime ();

                            if (previousData.ViewerStrength != "No ViewerStrength" && previousData.ViewerStrength != null) {
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = previousData.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = previousData.Ranking;
                                propertyFlowInterestVMObj.Performance = previousData.Performance;
                                propertyFlowInterestVMObj.RankingStatus = previousData.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = previousData.ViewCount;
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                propertyFlowInterestVMObj.Time = Time;
                            } else {
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                                propertyFlowInterestVMObj.Ranking = 0;
                                propertyFlowInterestVMObj.Performance = "No flow";
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                propertyFlowInterestVMObj.RankingStatus = "No flow";
                                propertyFlowInterestVMObj.ViewCount = 0;
                                propertyFlowInterestVMObj.Time = Time;
                            }
                            PropertyFlowInterestHourlyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterestHourlyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterestHourlyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterestHourlyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterestHourlyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterestHourlyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterestHourlyObj.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterestHourlyObj.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                if (PropertyFlowInterestHourlyVMList.Count > 0) {
                                    if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                        if (beforePreviousData != null && beforePreviousData.ViewerStrength != "No ViewerStrength") {
                                            previousData.ViewerStrength = PropertyFlowInterestHourlyObj.ViewerStrength;
                                            previousData.Ranking = PropertyFlowInterestHourlyObj.Ranking;
                                            previousData.Performance = PropertyFlowInterestHourlyObj.Performance;
                                            previousData.RankingStatus = PropertyFlowInterestHourlyObj.RankingStatus;
                                            previousData.ViewCount = PropertyFlowInterestHourlyObj.ViewCount;
                                            var tempData = PropertyFlowInterestHourlyVMList[length - 1];
                                            PropertyFlowInterestHourlyVMList[length - 1] = previousData;
                                            PropertyFlowInterestHourlyVMList[length - 1].Time = tempData.Time;
                                            PropertyFlowInterestHourlyVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                        }
                                    }
                                }
                                PropertyFlowInterestHourlyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }
                }
                if (TimeWeightedPropertyFlowInterestHourlyList.Count == 0) {

                    var hours = 24;
                    for (int i = hours; i >= 0;) {
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                        propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                        propertyFlowInterestVMObj.Ranking = 0;
                        propertyFlowInterestVMObj.Performance = "No flow";
                        propertyFlowInterestVMObj.RankingStatus = "No flow";
                        propertyFlowInterestVMObj.ViewCount = 0;
                        var From = i;
                        var To = i - 1;

                        var fromDate = nowTime.AddHours (-From).AddSeconds (0).AddMilliseconds (0);
                        var toDate = nowTime.AddHours (-From).AddMinutes (59).AddSeconds (59).AddMilliseconds (59);
                        //  var fromDate = nowTime.AddHours (-From);
                        // var toDate = nowTime.AddHours (-To);

                        // var Time = toDate.ToLocalTime ().ToString ("hh:mm");
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        propertyFlowInterestVMObj.Time = Time;
                        propertyFlowInterestVMObj.CreatedOn = fromDate;
                        //  PropertyFlowInterestVMObj.CreatedOn = toDate;
                        PropertyFlowInterestHourlyVMList.Add (propertyFlowInterestVMObj);
                        i -= 1;
                    }
                }
                return new OperationResult<List<PropertyFlowInterestVM>> (true, "", PropertyFlowInterestHourlyVMList);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyFlowInterestVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
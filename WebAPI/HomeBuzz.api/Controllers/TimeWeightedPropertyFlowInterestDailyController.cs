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
    public class TimeWeightedPropertyFlowInterestDailyController : Controller {

        private readonly ITimeWeightedPropertyFlowInterestDailyService _timeWeightedPropertyFlowInterestDailyService;
        private readonly IPropertyViewService _propertyViewService;
        private ErrorLogService errorlogservice;

        public TimeWeightedPropertyFlowInterestDailyController (
            ITimeWeightedPropertyFlowInterestDailyService timeWeightedPropertyFlowInterestDailyService,
            IPropertyViewService propertyViewService
        ) {
            _timeWeightedPropertyFlowInterestDailyService = timeWeightedPropertyFlowInterestDailyService;
            _propertyViewService = propertyViewService;
        }

        [HttpGet ("GetPropertyFlowInterest")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetPropertyFlowInterestByDaily (int PropertyDetailId) {
            try {
                var TimeWeightedPropertyFlowInterestDailyList = _timeWeightedPropertyFlowInterestDailyService.GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast28Days (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestDailyVMList = new List<PropertyFlowInterestVM> ();
                TimeWeightedPropertyFlowInterestDaily PropertyFlowInterestDailyObj = new TimeWeightedPropertyFlowInterestDaily ();
                if (TimeWeightedPropertyFlowInterestDailyList.Count > 0) {
                    PropertyFlowInterestDailyObj = TimeWeightedPropertyFlowInterestDailyList[0];
                }
                var nowTime = DateTime.Today.AddDays (-1);
                // nowTime = nowTime.Date.AddHours (23).AddMinutes (59).AddSeconds (59);

                if (TimeWeightedPropertyFlowInterestDailyList.Count >= 28) {
                    var days = 28;
                    for (int i = days; i >= 0;) {
                        var From = i;
                        // var To = i - 1;
                        var fromDate = nowTime.AddDays (-From);
                        fromDate = fromDate.AddHours(0).AddMinutes(0).AddSeconds(0).AddMilliseconds(0);
                        // var toDate = nowTime.AddDays (-To);
                        var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        //  if (toDate.Date > nowTime.Date) {
                        //     i -= 1;
                        //     continue;
                        // }
                        toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestDailyVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestDailyVMList[length - 1];
                        }

                        var carts = TimeWeightedPropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                            // }
                            PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterestDailyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterestDailyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterestDailyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterestDailyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterestDailyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterestDailyObj.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterestDailyObj.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = toDate;
                                PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }
                }
                if (TimeWeightedPropertyFlowInterestDailyList.Count < 28 && TimeWeightedPropertyFlowInterestDailyList.Count > 0) {

                    // Days Code

                    var days = 28;
                    for (int i = days; i >= 0;) {
                        var From = i;
                        var To = i - 1;
                        var fromDate = nowTime.AddDays (-From);
                        fromDate = fromDate.AddHours(0).AddMinutes(0).AddSeconds(0).AddMilliseconds(0);
                        var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        // var toDate = nowTime.AddDays (-To);
                        //   if (toDate.Date > nowTime.Date) {
                        //     i -= 1;
                        //     continue;
                        // }
                        toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestDailyVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestDailyVMList[length - 1];
                        }

                        var carts = TimeWeightedPropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                            PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterestDailyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterestDailyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterestDailyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterestDailyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterestDailyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterestDailyObj.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterestDailyObj.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = toDate;
                                PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }

                }
                if (TimeWeightedPropertyFlowInterestDailyList.Count == 0) {

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
                        var To = i - 1;
                        var fromDate = nowTime.AddDays (-From);
                        fromDate = fromDate.AddHours(0).AddMinutes(0).AddSeconds(0).AddMilliseconds(0);
                        var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        // var toDate = nowTime.AddDays (-To);
                        //    if (toDate.Date > nowTime.Date) {
                        //     i -= 1;
                        //     continue;
                        // }
                        toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                        var ToLocalFromDate = toDate.ToLocalTime ();
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        propertyFlowInterestVMObj.Time = Time;
                        propertyFlowInterestVMObj.CreatedOn = toDate;
                        PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                        i -= 1;
                    }
                }
                return new OperationResult<List<PropertyFlowInterestVM>> (true, "", PropertyFlowInterestDailyVMList);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyFlowInterestVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpGet ("GetHotPropertyFlowInterest")]
        public async Task<OperationResult<List<HotPropertyFlowInterestVM>>> GetHotPropertyFlowInterest (string PropertyDetailIds) {
            try {
                var PropertyDetailIdList = PropertyDetailIds.Split(",");
                List<HotPropertyFlowInterestVM> HotPropertyFlowInterestVMList = new List<HotPropertyFlowInterestVM> ();
                for (int index = 0; index < PropertyDetailIdList.Length; index++) {
                    HotPropertyFlowInterestVM hotPropertyFlowInterestVMObj = new HotPropertyFlowInterestVM ();
                    var PropertyDetailId = Convert.ToInt32(PropertyDetailIdList[index]);
                    hotPropertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                    

                    var TimeWeightedPropertyFlowInterestDailyList = _timeWeightedPropertyFlowInterestDailyService.GetAllTimeWeightedPropertyFlowInterestByPropertyDetailIdLast28Days (PropertyDetailId);
                    List<PropertyFlowInterestVM> PropertyFlowInterestDailyVMList = new List<PropertyFlowInterestVM> ();
                    TimeWeightedPropertyFlowInterestDaily TimeWeightedPropertyFlowInterestDailyObj = new TimeWeightedPropertyFlowInterestDaily ();
                    if (TimeWeightedPropertyFlowInterestDailyList.Count > 0) {
                        TimeWeightedPropertyFlowInterestDailyObj = TimeWeightedPropertyFlowInterestDailyList[0];
                    }
                    var nowTime = DateTime.Today.AddDays (-1);

                    if (TimeWeightedPropertyFlowInterestDailyList.Count >= 28) {
                        var days = 28;
                        for (int i = days; i >= 0;) {
                            var From = i;
                            var fromDate = nowTime.AddDays (-From);
                            fromDate = fromDate.AddHours(0).AddMinutes(0).AddSeconds(0).AddMilliseconds(0);
                            var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                            var length = PropertyFlowInterestDailyVMList.Count;
                            PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                            if (length > 0) {
                                previousData = PropertyFlowInterestDailyVMList[length - 1];
                            }

                            var carts = TimeWeightedPropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                                PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            } else {
                                if (carts.Count > 0) {
                                    TimeWeightedPropertyFlowInterestDailyObj = carts[carts.Count - 1];
                                    propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                    propertyFlowInterestVMObj.ViewerStrength = TimeWeightedPropertyFlowInterestDailyObj.ViewerStrength;
                                    propertyFlowInterestVMObj.Ranking = TimeWeightedPropertyFlowInterestDailyObj.Ranking;
                                    propertyFlowInterestVMObj.Performance = TimeWeightedPropertyFlowInterestDailyObj.Performance;
                                    propertyFlowInterestVMObj.Time = Time;
                                    propertyFlowInterestVMObj.RankingStatus = TimeWeightedPropertyFlowInterestDailyObj.RankingStatus;
                                    propertyFlowInterestVMObj.ViewCount = TimeWeightedPropertyFlowInterestDailyObj.ViewCount;
                                    var ToLocalFromDate = TimeWeightedPropertyFlowInterestDailyObj.CreatedOn.Value.ToLocalTime ();
                                    propertyFlowInterestVMObj.CreatedOn = toDate;
                                    PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                                }
                            }
                            i -= 1;
                        }
                        hotPropertyFlowInterestVMObj.FlowInterest = PropertyFlowInterestDailyVMList;
                        HotPropertyFlowInterestVMList.Add(hotPropertyFlowInterestVMObj);
                    }
                    if (TimeWeightedPropertyFlowInterestDailyList.Count < 28 && TimeWeightedPropertyFlowInterestDailyList.Count > 0) {

                        // Days Code

                        var days = 28;
                        for (int i = days; i >= 0;) {
                            var From = i;
                            var To = i - 1;
                            var fromDate = nowTime.AddDays (-From);
                            fromDate = fromDate.AddHours(0).AddMinutes(0).AddSeconds(0).AddMilliseconds(0);
                            var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                            var length = PropertyFlowInterestDailyVMList.Count;
                            PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                            if (length > 0) {
                                previousData = PropertyFlowInterestDailyVMList[length - 1];
                            }

                            var carts = TimeWeightedPropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                                PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            } else {
                                if (carts.Count > 0) {
                                    TimeWeightedPropertyFlowInterestDailyObj = carts[carts.Count - 1];
                                    propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                    propertyFlowInterestVMObj.ViewerStrength = TimeWeightedPropertyFlowInterestDailyObj.ViewerStrength;
                                    propertyFlowInterestVMObj.Ranking = TimeWeightedPropertyFlowInterestDailyObj.Ranking;
                                    propertyFlowInterestVMObj.Performance = TimeWeightedPropertyFlowInterestDailyObj.Performance;
                                    propertyFlowInterestVMObj.Time = Time;
                                    propertyFlowInterestVMObj.RankingStatus = TimeWeightedPropertyFlowInterestDailyObj.RankingStatus;
                                    propertyFlowInterestVMObj.ViewCount = TimeWeightedPropertyFlowInterestDailyObj.ViewCount;
                                    var ToLocalFromDate = TimeWeightedPropertyFlowInterestDailyObj.CreatedOn.Value.ToLocalTime ();
                                    propertyFlowInterestVMObj.CreatedOn = toDate;
                                    PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                                }
                            }
                            i -= 1;
                        }
                        hotPropertyFlowInterestVMObj.FlowInterest = PropertyFlowInterestDailyVMList;
                        HotPropertyFlowInterestVMList.Add(hotPropertyFlowInterestVMObj);
                    }
                    if (TimeWeightedPropertyFlowInterestDailyList.Count == 0) {

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
                            var To = i - 1;
                            var fromDate = nowTime.AddDays (-From);
                            fromDate = fromDate.AddHours(0).AddMinutes(0).AddSeconds(0).AddMilliseconds(0);
                            var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var ToLocalFromDate = toDate.ToLocalTime ();
                            var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                            propertyFlowInterestVMObj.Time = Time;
                            propertyFlowInterestVMObj.CreatedOn = toDate;
                            PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            i -= 1;
                        }
                        hotPropertyFlowInterestVMObj.FlowInterest = PropertyFlowInterestDailyVMList;
                        HotPropertyFlowInterestVMList.Add(hotPropertyFlowInterestVMObj);
                    }
                }
                return new OperationResult<List<HotPropertyFlowInterestVM>> (true, "", HotPropertyFlowInterestVMList);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<HotPropertyFlowInterestVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
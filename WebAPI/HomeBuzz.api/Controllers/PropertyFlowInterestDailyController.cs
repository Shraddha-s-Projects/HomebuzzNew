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
    [Route ("api/PropertyFlowInterestDaily")]
    public class PropertyFlowInterestDailyController : Controller {

        private readonly IPropertyFlowInterestDailyService _propertyFlowInterestDailyService;
        private readonly IPropertyViewService _propertyViewService;
        private ErrorLogService errorlogservice;

        public PropertyFlowInterestDailyController (
            IPropertyFlowInterestDailyService propertyFlowInterestDailyService,
            IPropertyViewService propertyViewService
        ) {
            _propertyFlowInterestDailyService = propertyFlowInterestDailyService;
            _propertyViewService = propertyViewService;
        }

        [HttpGet ("GetPropertyFlowInterest")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetPropertyFlowInterestByDaily (int PropertyDetailId) {
            try {
                var PropertyFlowInterestDailyList = _propertyFlowInterestDailyService.GetAllPropertyFlowInterestByPropertyDetailIdLast28Days (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestDailyVMList = new List<PropertyFlowInterestVM> ();
                PropertyFlowInterestDaily PropertyFlowInterestDailyObj = new PropertyFlowInterestDaily ();
                if (PropertyFlowInterestDailyList.Count > 0) {
                    PropertyFlowInterestDailyObj = PropertyFlowInterestDailyList[0];
                }
                var nowTime = DateTime.Today.AddDays (-1);
                // nowTime = nowTime.Date.AddHours (23).AddMinutes (59).AddSeconds (59);

                if (PropertyFlowInterestDailyList.Count >= 28) {
                    var days = 28;
                    for (int i = days; i >= 0;) {
                        var From = i;
                        // var To = i - 1;
                        var fromDate = nowTime.AddDays (-From);
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

                        var carts = PropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            var ToLocalFromDate = toDate.ToLocalTime ();
                            // if (previousData.ViewerStrength != "No ViewerStrength" && previousData.ViewerStrength != null) {
                            //     propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                            //     propertyFlowInterestVMObj.ViewerStrength = previousData.ViewerStrength;
                            //     propertyFlowInterestVMObj.Ranking = previousData.Ranking;
                            //     propertyFlowInterestVMObj.Performance = previousData.Performance;
                            //     propertyFlowInterestVMObj.RankingStatus = previousData.RankingStatus;
                            //     propertyFlowInterestVMObj.ViewCount = previousData.ViewCount;
                            //     propertyFlowInterestVMObj.CreatedOn = fromDate;
                            //     propertyFlowInterestVMObj.Time = Time;
                            // } else {
                            propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                            propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                            propertyFlowInterestVMObj.Ranking = 0;
                            propertyFlowInterestVMObj.Performance = "No flow";
                            propertyFlowInterestVMObj.CreatedOn = toDate;
                            // propertyFlowInterestVMObj.CreatedOn = fromDate;
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
                                // propertyFlowInterestVMObj.CreatedOn = fromDate;
                                // if (PropertyFlowInterestDailyVMList.Count > 0) {
                                //     if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                //         previousData.ViewerStrength = PropertyFlowInterestDailyObj.ViewerStrength;
                                //         previousData.Ranking = PropertyFlowInterestDailyObj.Ranking;
                                //         previousData.Performance = PropertyFlowInterestDailyObj.Performance;
                                //         previousData.RankingStatus = PropertyFlowInterestDailyObj.RankingStatus;
                                //         previousData.ViewCount = PropertyFlowInterestDailyObj.ViewCount;
                                //         var tempData = PropertyFlowInterestDailyVMList[length - 1];
                                //         PropertyFlowInterestDailyVMList[length - 1] = previousData;
                                //         PropertyFlowInterestDailyVMList[length - 1].Time = tempData.Time;
                                //         PropertyFlowInterestDailyVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                //     }
                                // }
                                PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }
                }
                if (PropertyFlowInterestDailyList.Count < 28 && PropertyFlowInterestDailyList.Count > 0) {

                    // Days Code

                    var days = 28;
                    for (int i = days; i >= 0;) {
                        var From = i;
                        var To = i - 1;
                        var fromDate = nowTime.AddDays (-From);
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

                        var carts = PropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            var ToLocalFromDate = toDate.ToLocalTime ();
                            // if (previousData.ViewerStrength != "No ViewerStrength" && previousData.ViewerStrength != null) {
                            //     propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                            //     propertyFlowInterestVMObj.ViewerStrength = previousData.ViewerStrength;
                            //     propertyFlowInterestVMObj.Ranking = previousData.Ranking;
                            //     propertyFlowInterestVMObj.Performance = previousData.Performance;
                            //     propertyFlowInterestVMObj.RankingStatus = previousData.RankingStatus;
                            //     propertyFlowInterestVMObj.ViewCount = previousData.ViewCount;
                            //     propertyFlowInterestVMObj.CreatedOn = fromDate;
                            //     propertyFlowInterestVMObj.Time = Time;
                            // } else {
                            propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                            propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                            propertyFlowInterestVMObj.Ranking = 0;
                            propertyFlowInterestVMObj.Performance = "No flow";
                            // propertyFlowInterestVMObj.CreatedOn = fromDate;
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
                                // propertyFlowInterestVMObj.CreatedOn = fromDate;
                                // if (PropertyFlowInterestDailyVMList.Count > 0) {
                                //     if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                //         previousData.ViewerStrength = PropertyFlowInterestDailyObj.ViewerStrength;
                                //         previousData.Ranking = PropertyFlowInterestDailyObj.Ranking;
                                //         previousData.Performance = PropertyFlowInterestDailyObj.Performance;
                                //         previousData.RankingStatus = PropertyFlowInterestDailyObj.RankingStatus;
                                //         previousData.ViewCount = PropertyFlowInterestDailyObj.ViewCount;
                                //         var tempData = PropertyFlowInterestDailyVMList[length - 1];
                                //         PropertyFlowInterestDailyVMList[length - 1] = previousData;
                                //         PropertyFlowInterestDailyVMList[length - 1].Time = tempData.Time;
                                //         PropertyFlowInterestDailyVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                //     }
                                // }
                                PropertyFlowInterestDailyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }

                }
                if (PropertyFlowInterestDailyList.Count == 0) {

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
                        // propertyFlowInterestVMObj.CreatedOn = fromDate;
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
                    

                    var PropertyFlowInterestDailyList = _propertyFlowInterestDailyService.GetAllPropertyFlowInterestByPropertyDetailIdLast28Days (PropertyDetailId);
                    List<PropertyFlowInterestVM> PropertyFlowInterestDailyVMList = new List<PropertyFlowInterestVM> ();
                    PropertyFlowInterestDaily PropertyFlowInterestDailyObj = new PropertyFlowInterestDaily ();
                    if (PropertyFlowInterestDailyList.Count > 0) {
                        PropertyFlowInterestDailyObj = PropertyFlowInterestDailyList[0];
                    }
                    var nowTime = DateTime.Today.AddDays (-1);

                    if (PropertyFlowInterestDailyList.Count >= 28) {
                        var days = 28;
                        for (int i = days; i >= 0;) {
                            var From = i;
                            var fromDate = nowTime.AddDays (-From);
                            var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                            var length = PropertyFlowInterestDailyVMList.Count;
                            PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                            if (length > 0) {
                                previousData = PropertyFlowInterestDailyVMList[length - 1];
                            }

                            var carts = PropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                        hotPropertyFlowInterestVMObj.FlowInterest = PropertyFlowInterestDailyVMList;
                        HotPropertyFlowInterestVMList.Add(hotPropertyFlowInterestVMObj);
                    }
                    if (PropertyFlowInterestDailyList.Count < 28 && PropertyFlowInterestDailyList.Count > 0) {

                        // Days Code

                        var days = 28;
                        for (int i = days; i >= 0;) {
                            var From = i;
                            var To = i - 1;
                            var fromDate = nowTime.AddDays (-From);
                            var toDate = fromDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            toDate = toDate.Date.AddHours (23).AddMinutes (59).AddSeconds (59);
                            var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                            var length = PropertyFlowInterestDailyVMList.Count;
                            PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                            if (length > 0) {
                                previousData = PropertyFlowInterestDailyVMList[length - 1];
                            }

                            var carts = PropertyFlowInterestDailyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                        hotPropertyFlowInterestVMObj.FlowInterest = PropertyFlowInterestDailyVMList;
                        HotPropertyFlowInterestVMList.Add(hotPropertyFlowInterestVMObj);
                    }
                    if (PropertyFlowInterestDailyList.Count == 0) {

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
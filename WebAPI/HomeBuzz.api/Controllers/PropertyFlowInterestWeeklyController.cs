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
    [Route ("api/PropertyFlowInterestWeekly")]
    public class PropertyFlowInterestWeeklyController : Controller {
        private readonly IPropertyFlowInterestWeeklyService _propertyFlowInterestWeeklyService;
        private readonly IPropertyViewService _propertyViewService;
        private ErrorLogService errorlogservice;

        public PropertyFlowInterestWeeklyController (
            IPropertyFlowInterestWeeklyService propertyFlowInterestWeeklyService,
            IPropertyViewService propertyViewService
        ) {
            _propertyFlowInterestWeeklyService = propertyFlowInterestWeeklyService;
            _propertyViewService = propertyViewService;

        }

        [HttpGet ("GetPropertyFlowInterest")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetPropertyFlowInterestByWeekly (int PropertyDetailId) {
            try {
                var PropertyFlowInterestWeeklyList = _propertyFlowInterestWeeklyService.GetAllPropertyFlowInterestWeeklyByPropertyDetailIdLast4Weeks (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestWeeklyVMList = new List<PropertyFlowInterestVM> ();
                PropertyFlowInterestWeekly PropertyFlowInterestWeeklyObj = new PropertyFlowInterestWeekly ();
                if (PropertyFlowInterestWeeklyList.Count > 0) {
                    PropertyFlowInterestWeeklyObj = PropertyFlowInterestWeeklyList[0];
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

                if (PropertyFlowInterestWeeklyList.Count >= 4) {
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

                        var carts = PropertyFlowInterestWeeklyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                            PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterestWeeklyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterestWeeklyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterestWeeklyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterestWeeklyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterestWeeklyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterestWeeklyObj.ViewCount;
                                propertyFlowInterestVMObj.CreatedOn = toDate;
                                // propertyFlowInterestVMObj.CreatedOn = fromDate;
                                // if (PropertyFlowInterestWeeklyVMList.Count > 0) {
                                //     if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                //         previousData.ViewerStrength = PropertyFlowInterestWeeklyObj.ViewerStrength;
                                //         previousData.Ranking = PropertyFlowInterestWeeklyObj.Ranking;
                                //         previousData.Performance = PropertyFlowInterestWeeklyObj.Performance;
                                //         previousData.RankingStatus = PropertyFlowInterestWeeklyObj.RankingStatus;
                                //         previousData.ViewCount = PropertyFlowInterestWeeklyObj.ViewCount;
                                //         var tempData = PropertyFlowInterestWeeklyVMList[length - 1];
                                //         PropertyFlowInterestWeeklyVMList[length - 1] = previousData;
                                //         PropertyFlowInterestWeeklyVMList[length - 1].Time = tempData.Time;
                                //         PropertyFlowInterestWeeklyVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                //     }
                                // }
                                PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 7;
                    }
                }
                if (PropertyFlowInterestWeeklyList.Count < 4 && PropertyFlowInterestWeeklyList.Count > 0) {

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

                        var carts = PropertyFlowInterestWeeklyList.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
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
                            PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterestWeeklyObj = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterestWeeklyObj.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterestWeeklyObj.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterestWeeklyObj.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterestWeeklyObj.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterestWeeklyObj.ViewCount;
                                // propertyFlowInterestVMObj.CreatedOn = fromDate;
                                propertyFlowInterestVMObj.CreatedOn = toDate;
                                // if (PropertyFlowInterestWeeklyVMList.Count > 0) {
                                //     if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                //         previousData.ViewerStrength = PropertyFlowInterestWeeklyObj.ViewerStrength;
                                //         previousData.Ranking = PropertyFlowInterestWeeklyObj.Ranking;
                                //         previousData.Performance = PropertyFlowInterestWeeklyObj.Performance;
                                //         previousData.RankingStatus = PropertyFlowInterestWeeklyObj.RankingStatus;
                                //         previousData.ViewCount = PropertyFlowInterestWeeklyObj.ViewCount;
                                //         var tempData = PropertyFlowInterestWeeklyVMList[length - 1];
                                //         PropertyFlowInterestWeeklyVMList[length - 1] = previousData;
                                //         PropertyFlowInterestWeeklyVMList[length - 1].Time = tempData.Time;
                                //         PropertyFlowInterestWeeklyVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                //     }
                                // }
                                PropertyFlowInterestWeeklyVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 7;
                    }

                }
                if (PropertyFlowInterestWeeklyList.Count == 0) {

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
                        // propertyFlowInterestVMObj.CreatedOn = fromDate;
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
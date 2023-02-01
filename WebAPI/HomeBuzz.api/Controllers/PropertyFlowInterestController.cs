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
    [Route ("api/PropertyFlowInterest")]
    public class PropertyFlowInterestController : Controller {
        private readonly IPropertyFlowInterestService _propertyFlowInterestService;
        private readonly IPropertyViewService _propertyViewService;
        private ErrorLogService errorlogservice;

        public PropertyFlowInterestController (
            IPropertyFlowInterestService propertyFlowInterestService,
            IPropertyViewService propertyViewService
        ) {
            _propertyFlowInterestService = propertyFlowInterestService;
            _propertyViewService = propertyViewService;
        }

        [HttpGet ("GetPropertyFlowInterest")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetPropertyFlowInterest (int PropertyDetailId) {
            try {
                var PropertyFlowInterests = _propertyFlowInterestService.GetAllPropertyFlowInterestByPropertyDetailId (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestVMList = new List<PropertyFlowInterestVM> ();
                PropertyFlowInterest PropertyFlowInterest = new PropertyFlowInterest ();
                if (PropertyFlowInterests.Count > 0) {
                    PropertyFlowInterest = PropertyFlowInterests[0];
                }
                // var newDate = DateTime.Now;
                var nowTime = DateTime.UtcNow;
                var Minute = nowTime.Minute;
                if (Minute % 5 != 0) {
                    var remainder = Minute % 5;
                    nowTime = nowTime.AddMinutes (-remainder);
                }

                if (PropertyFlowInterests.Count >= 24) {
                    // if (PropertyFlowInterests.Count >= 48) {
                    foreach (var item in PropertyFlowInterests) {
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        var CreatedTimeMinutes = item.CreatedOn.Value.Minute;
                        if (CreatedTimeMinutes % 5 != 0) {
                            var remainder1 = CreatedTimeMinutes % 5;
                            item.CreatedOn = item.CreatedOn.Value.AddMinutes (-remainder1);
                        }
                        propertyFlowInterestVMObj.CreatedOn = item.CreatedOn;
                        propertyFlowInterestVMObj.ViewerStrength = item.ViewerStrength;
                        propertyFlowInterestVMObj.Ranking = item.Ranking;
                        propertyFlowInterestVMObj.PropertyDetailId = item.PropertyDetailId;
                        propertyFlowInterestVMObj.Performance = item.Performance;
                        propertyFlowInterestVMObj.RankingStatus = item.RankingStatus;
                        propertyFlowInterestVMObj.ViewCount = item.ViewCount;
                        var Time = item.CreatedOn.Value.ToLocalTime ().ToString ("hh:mm");
                        propertyFlowInterestVMObj.Time = Time;
                        PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                    }
                }
                if (PropertyFlowInterests.Count < 24 && PropertyFlowInterests.Count > 0) {
                    var minute = 120;
                    // if (PropertyFlowInterests.Count < 48 && PropertyFlowInterests.Count > 0) {
                    //     var minute = 240;
                    for (int i = minute; i >= 0;) {
                        var From = i;
                        var To = i - 5;
                        var fromDate = nowTime.AddMinutes (-From);
                        var toDate = nowTime.AddMinutes (-To);
                        // var Time = toDate.ToLocalTime ().ToString ("hh:mm");
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestVMList[length - 1];
                        }

                        var carts = PropertyFlowInterests.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        if (carts.Count == 0) {
                            // PropertyFlowInterestVMObj.Time = Time;
                            var ToLocalFromDate = toDate.ToLocalTime ();
                            if (previousData.ViewerStrength != "No ViewerStrength" && previousData.ViewerStrength != null) {
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = previousData.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = previousData.Ranking;
                                propertyFlowInterestVMObj.Performance = previousData.Performance;
                                propertyFlowInterestVMObj.RankingStatus = previousData.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = previousData.ViewCount;
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                // PropertyFlowInterestVMObj.CreatedOn = toDate;
                                // PropertyFlowInterestVMObj.CreatedOn = ToLocalFromDate;
                                propertyFlowInterestVMObj.Time = Time;
                            } else {
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                                propertyFlowInterestVMObj.Ranking = 0;
                                propertyFlowInterestVMObj.Performance = "No flow";
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                propertyFlowInterestVMObj.RankingStatus = "No flow";
                                propertyFlowInterestVMObj.ViewCount = 0;
                                // PropertyFlowInterestVMObj.CreatedOn = toDate;
                                // PropertyFlowInterestVMObj.CreatedOn = ToLocalFromDate;
                                propertyFlowInterestVMObj.Time = Time;
                            }
                            PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterest = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterest.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterest.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterest.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterest.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterest.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterest.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                // PropertyFlowInterestVMObj.CreatedOn = toDate;
                                // PropertyFlowInterestVMObj.CreatedOn = ToLocalFromDate;
                                if (PropertyFlowInterestVMList.Count > 0) {
                                    if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                        previousData.ViewerStrength = PropertyFlowInterest.ViewerStrength;
                                        previousData.Ranking = PropertyFlowInterest.Ranking;
                                        previousData.Performance = PropertyFlowInterest.Performance;
                                        previousData.RankingStatus = PropertyFlowInterest.RankingStatus;
                                        previousData.ViewCount = PropertyFlowInterest.ViewCount;
                                        var tempData = PropertyFlowInterestVMList[length - 1];
                                        PropertyFlowInterestVMList[length - 1] = previousData;
                                        PropertyFlowInterestVMList[length - 1].Time = tempData.Time;
                                        PropertyFlowInterestVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                    }
                                }
                                PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 5;
                    }
                }
                if (PropertyFlowInterests.Count == 0) {
                    // List<PropertyFlowInterest> PropertyFlowInterestList = new List<PropertyFlowInterest> ();
                    var minute = 120;
                    for (int i = minute; i >= 0;) {
                        PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                        propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                        propertyFlowInterestVMObj.ViewerStrength = "No ViewerStrength";
                        propertyFlowInterestVMObj.Ranking = 0;
                        propertyFlowInterestVMObj.Performance = "No flow";
                        propertyFlowInterestVMObj.RankingStatus = "No flow";
                        propertyFlowInterestVMObj.ViewCount = 0;
                        var From = i;
                        var To = i - 5;
                        var fromDate = nowTime.AddMinutes (-From);
                        var toDate = nowTime.AddMinutes (-To);
                        var ToLocalFromDate = toDate.ToLocalTime ();
                        // var Time = toDate.ToLocalTime ().ToString ("hh:mm");
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        propertyFlowInterestVMObj.Time = Time;
                        propertyFlowInterestVMObj.CreatedOn = fromDate;
                        //  PropertyFlowInterestVMObj.CreatedOn = toDate;
                        // PropertyFlowInterestVMObj.CreatedOn = ToLocalFromDate;
                        PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                        i -= 5;
                    }
                }
                return new OperationResult<List<PropertyFlowInterestVM>> (true, "", PropertyFlowInterestVMList);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyFlowInterestVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpGet ("GetPropertyFlowInterestByHourly")]
        public async Task<OperationResult<List<PropertyFlowInterestVM>>> GetPropertyFlowInterestByHourly (int PropertyDetailId) {
            try {
                var PropertyFlowInterests = _propertyFlowInterestService.GetAllPropertyFlowInterestByPropertyDetailIdLast24Hours (PropertyDetailId);
                List<PropertyFlowInterestVM> PropertyFlowInterestVMList = new List<PropertyFlowInterestVM> ();
                PropertyFlowInterest PropertyFlowInterest = new PropertyFlowInterest ();
                if (PropertyFlowInterests.Count > 0) {
                    PropertyFlowInterest = PropertyFlowInterests[0];
                }
                var nowTime = DateTime.UtcNow;
                var Minute = nowTime.Minute;
                
                 if (Minute > 0) {
                    nowTime = nowTime.AddMinutes (-Minute);
                }

                if (PropertyFlowInterests.Count >= 24) {
                    // foreach (var item in PropertyFlowInterests) {
                    //     PropertyFlowInterestVM propertyFlowInterestVMObj = new PropertyFlowInterestVM ();
                    //     var CreatedTimeHours = item.CreatedOn.Value.Hour;
                    //     propertyFlowInterestVMObj.CreatedOn = item.CreatedOn;
                    //     propertyFlowInterestVMObj.ViewerStrength = item.ViewerStrength;
                    //     propertyFlowInterestVMObj.Ranking = item.Ranking;
                    //     propertyFlowInterestVMObj.PropertyDetailId = item.PropertyDetailId;
                    //     propertyFlowInterestVMObj.Performance = item.Performance;
                    //     propertyFlowInterestVMObj.RankingStatus = item.RankingStatus;
                    //     propertyFlowInterestVMObj.ViewCount = item.ViewCount;
                    //     var Time = item.CreatedOn.Value.ToLocalTime ().ToString ("hh:mm");
                    //     propertyFlowInterestVMObj.Time = Time;
                    //     PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                    // }

                     var hours = 24;
                    for (int i = hours; i >= 0;) {
                        var From = i;
                        var To = i - 1;
                        var fromDate = nowTime.AddHours (-From);
                        var toDate = nowTime.AddHours (-To);
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestVMList[length - 1];
                        }

                        var carts = PropertyFlowInterests.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                            PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterest = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterest.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterest.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterest.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterest.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterest.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterest.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                if (PropertyFlowInterestVMList.Count > 0) {
                                    if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                        previousData.ViewerStrength = PropertyFlowInterest.ViewerStrength;
                                        previousData.Ranking = PropertyFlowInterest.Ranking;
                                        previousData.Performance = PropertyFlowInterest.Performance;
                                        previousData.RankingStatus = PropertyFlowInterest.RankingStatus;
                                        previousData.ViewCount = PropertyFlowInterest.ViewCount;
                                        var tempData = PropertyFlowInterestVMList[length - 1];
                                        PropertyFlowInterestVMList[length - 1] = previousData;
                                        PropertyFlowInterestVMList[length - 1].Time = tempData.Time;
                                        PropertyFlowInterestVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                    }
                                }
                                PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }
                }
                if (PropertyFlowInterests.Count < 24 && PropertyFlowInterests.Count > 0) {
                    
                    // Hours Code

                    var hours = 24;
                    for (int i = hours; i >= 0;) {
                        var From = i;
                        var To = i - 1;
                        var fromDate = nowTime.AddHours (-From);
                        var toDate = nowTime.AddHours (-To);
                        // var Time = toDate.ToLocalTime ().ToString ("hh:mm");
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        var length = PropertyFlowInterestVMList.Count;
                        PropertyFlowInterestVM previousData = new PropertyFlowInterestVM ();
                        if (length > 0) {
                            previousData = PropertyFlowInterestVMList[length - 1];
                        }

                        var carts = PropertyFlowInterests.Where (t => t.CreatedOn > fromDate && t.CreatedOn <= toDate).ToList ();
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
                            PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                        } else {
                            if (carts.Count > 0) {
                                PropertyFlowInterest = carts[carts.Count - 1];
                                propertyFlowInterestVMObj.PropertyDetailId = PropertyDetailId;
                                propertyFlowInterestVMObj.ViewerStrength = PropertyFlowInterest.ViewerStrength;
                                propertyFlowInterestVMObj.Ranking = PropertyFlowInterest.Ranking;
                                propertyFlowInterestVMObj.Performance = PropertyFlowInterest.Performance;
                                propertyFlowInterestVMObj.Time = Time;
                                propertyFlowInterestVMObj.RankingStatus = PropertyFlowInterest.RankingStatus;
                                propertyFlowInterestVMObj.ViewCount = PropertyFlowInterest.ViewCount;
                                var ToLocalFromDate = PropertyFlowInterest.CreatedOn.Value.ToLocalTime ();
                                propertyFlowInterestVMObj.CreatedOn = fromDate;
                                if (PropertyFlowInterestVMList.Count > 0) {
                                    if (previousData.ViewerStrength == "No ViewerStrength" && previousData.ViewerStrength != null) {
                                        previousData.ViewerStrength = PropertyFlowInterest.ViewerStrength;
                                        previousData.Ranking = PropertyFlowInterest.Ranking;
                                        previousData.Performance = PropertyFlowInterest.Performance;
                                        previousData.RankingStatus = PropertyFlowInterest.RankingStatus;
                                        previousData.ViewCount = PropertyFlowInterest.ViewCount;
                                        var tempData = PropertyFlowInterestVMList[length - 1];
                                        PropertyFlowInterestVMList[length - 1] = previousData;
                                        PropertyFlowInterestVMList[length - 1].Time = tempData.Time;
                                        PropertyFlowInterestVMList[length - 1].CreatedOn = tempData.CreatedOn;
                                    }
                                }
                                PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                            }
                        }
                        i -= 1;
                    }

                }
                if (PropertyFlowInterests.Count == 0) {

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
                        var fromDate = nowTime.AddHours (-From);
                        var toDate = nowTime.AddHours (-To);
                        var ToLocalFromDate = toDate.ToLocalTime ();
                        // var Time = toDate.ToLocalTime ().ToString ("hh:mm");
                        var Time = fromDate.ToLocalTime ().ToString ("hh:mm");
                        propertyFlowInterestVMObj.Time = Time;
                        propertyFlowInterestVMObj.CreatedOn = fromDate;
                        //  PropertyFlowInterestVMObj.CreatedOn = toDate;
                        // PropertyFlowInterestVMObj.CreatedOn = ToLocalFromDate;
                        PropertyFlowInterestVMList.Add (propertyFlowInterestVMObj);
                        i -= 1;
                    }
                }
                return new OperationResult<List<PropertyFlowInterestVM>> (true, "", PropertyFlowInterestVMList);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyFlowInterestVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}
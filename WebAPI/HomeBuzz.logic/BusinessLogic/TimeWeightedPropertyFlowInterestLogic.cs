using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models.Tables;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.helper;
using HomeBuzz.logic.Common;

namespace HomeBuzz.logic.BusinessLogic {
    public class TimeWeightedPropertyFlowInterestLogic {
        private readonly ITimeWeightedPropertyFlowInterestHourlyService _timeWeightedPropertyFlowInterestHourlyService;
        private readonly ITimeWeightedPropertyFlowInterestDailyService _timeWeightedPropertyFlowInterestDailyService;
        private readonly ITimeWeightedPropertyFlowInterestWeeklyService _timeWeightedPropertyFlowInterestWeeklyService;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;
        private ErrorLogService errorlogservice;

        public TimeWeightedPropertyFlowInterestLogic (
            ITimeWeightedPropertyFlowInterestHourlyService timeWeightedPropertyFlowInterestHourlyService,
            ITimeWeightedPropertyFlowInterestDailyService timeWeightedPropertyFlowInterestDailyService,
            ITimeWeightedPropertyFlowInterestWeeklyService timeWeightedPropertyFlowInterestWeeklyService,
            IPropertyViewService propertyViewService,
            IPropertyDetailService propertyDetailService,
            IPropertyCrudDataService propertyCrudDataService
        ) {
            _timeWeightedPropertyFlowInterestHourlyService = timeWeightedPropertyFlowInterestHourlyService;
            _timeWeightedPropertyFlowInterestDailyService = timeWeightedPropertyFlowInterestDailyService;
            _timeWeightedPropertyFlowInterestWeeklyService = timeWeightedPropertyFlowInterestWeeklyService;
            _propertyViewService = propertyViewService;
            _propertyDetailService = propertyDetailService;
            _propertyCrudDataService = propertyCrudDataService;
        }

        public async Task<OperationResult<List<PropertyViewFinalRankedVM>>> AddUpdate (string flowInterestType) {
            try {
                var totalProperties = 0;
                var totalPropertyViews = 0;
                var ViewBlockSize = 4;
                var BlockDiff = 0;
                List<PropertyViewFinalRankedVM> RankedList = new List<PropertyViewFinalRankedVM> ();
                var listData = await FlowInterest ();
                if (listData.Success == true) {
                    RankedList = listData.Model;
                }

                foreach (var item in RankedList) {
                    var secondList = RankedList.Where (t => t.Status == item.Status).ToList ();
                    double TotlaViewCount = 0;
                    decimal ComparativeInterest = 0;
                    decimal ViewBlock = 0;
                    decimal PerformanceRange = 0;
                    decimal HigherPerformanceRange = 0;
                    decimal LowerPerformanceRange = 0;
                    var Performance = "";
                    var ViewerStrength = "";
                    for (int i = 0; i < secondList.Count (); i++) {
                        // TotlaViewCount += secondList[i].ViewCount.Value;
                        TotlaViewCount = TotlaViewCount + secondList[i].ViewCount.Value;
                    }

                    if (secondList.Count () == 0) {
                        ComparativeInterest = 0;
                    } else {
                        var count = secondList.Count ();
                        var ComparativeInterest_Test = Math.Ceiling ((TotlaViewCount) / (count));
                        ComparativeInterest = Convert.ToInt16 (ComparativeInterest_Test);
                    }

                    ViewBlock = Math.Ceiling (Convert.ToDecimal (item.ViewCount.Value) / ViewBlockSize);
                    PerformanceRange = ViewBlock + BlockDiff;
                    HigherPerformanceRange = item.ViewCount.Value + PerformanceRange;
                    LowerPerformanceRange = item.ViewCount.Value - PerformanceRange;

                    if (ComparativeInterest > HigherPerformanceRange) {
                        Performance = "Under average";
                    } else if (ComparativeInterest >= LowerPerformanceRange) {
                        Performance = "Average";
                    } else {
                        Performance = "Above average";
                    }

                    if (Performance == "Above average" && item.Ranked > 0) {
                        ViewerStrength = "Strong";
                    } else if (Performance == "Under average" && item.Ranked < 0) {
                        ViewerStrength = "Weak";
                    } else if (Performance == "Under average" && item.Ranked == 0) {
                        ViewerStrength = "Weak";
                    } else if (Performance == "Above average" && item.Ranked == 0) {
                        ViewerStrength = "Strong";
                    } else {
                        ViewerStrength = "Average";
                    }

                    if (FlowInterestType.Hourly.ToString () == flowInterestType) {
                        TimeWeightedPropertyFlowInterestHourly timeWeightedPropertyFlowInterestHourlyObj = new TimeWeightedPropertyFlowInterestHourly ();
                        timeWeightedPropertyFlowInterestHourlyObj.PropertyDetailId = item.PropertyDetailId;
                        timeWeightedPropertyFlowInterestHourlyObj.Ranking = item.Ranked;
                        timeWeightedPropertyFlowInterestHourlyObj.ComparativeInterest = Convert.ToInt16 (ComparativeInterest);
                        timeWeightedPropertyFlowInterestHourlyObj.ViewBlock = Convert.ToInt16 (ViewBlock);
                        timeWeightedPropertyFlowInterestHourlyObj.PerformanceRange = Convert.ToInt16 (PerformanceRange);
                        timeWeightedPropertyFlowInterestHourlyObj.HigherPerformanceRange = Convert.ToInt16 (HigherPerformanceRange);
                        timeWeightedPropertyFlowInterestHourlyObj.LowerPerformanceRange = Convert.ToInt16 (LowerPerformanceRange);
                        timeWeightedPropertyFlowInterestHourlyObj.Performance = Performance;
                        timeWeightedPropertyFlowInterestHourlyObj.ViewerStrength = ViewerStrength;
                        List<Property> Last90Views = new List<Property> ();
                        if (RankedList.Count > 0) {
                            Last90Views = RankedList[0].Last90Views;
                        }
                        var LastViewedObj = Last90Views.Where (t => t.PropertyDetailId == item.PropertyDetailId).FirstOrDefault ();
                        if (LastViewedObj != null) {
                            timeWeightedPropertyFlowInterestHourlyObj.ViewCount = Convert.ToInt32 (LastViewedObj.ViewCount);
                            if (timeWeightedPropertyFlowInterestHourlyObj.Ranking > 0 && timeWeightedPropertyFlowInterestHourlyObj.ViewCount > 1) {
                                timeWeightedPropertyFlowInterestHourlyObj.RankingStatus = "hot";
                            } else if (timeWeightedPropertyFlowInterestHourlyObj.Ranking < 0) {
                                timeWeightedPropertyFlowInterestHourlyObj.RankingStatus = "cool";
                            } else {
                                timeWeightedPropertyFlowInterestHourlyObj.RankingStatus = "stable";
                            }
                        }

                        var dataHourly = _timeWeightedPropertyFlowInterestHourlyService.CheckPastDayExistProperty (timeWeightedPropertyFlowInterestHourlyObj);
                    }

                }

                return new OperationResult<List<PropertyViewFinalRankedVM>> (true, "", RankedList);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyViewFinalRankedVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        public async Task<OperationResult<List<PropertyViewFinalRankedVM>>> AddUpdateDaily (string flowInterestType) {
            try {
                var totalProperties = 0;
                var totalPropertyViews = 0;
                var ViewBlockSize = 4;
                var BlockDiff = 0;
                List<PropertyViewFinalRankedVM> RankedList = new List<PropertyViewFinalRankedVM> ();
                var listData = await FlowInterest ();
                if (listData.Success == true) {
                    RankedList = listData.Model;
                }

                foreach (var item in RankedList) {
                    // Console.WriteLine (item);
                    var secondList = RankedList.Where (t => t.Status == item.Status).ToList ();
                    double TotlaViewCount = 0;
                    decimal ComparativeInterest = 0;
                    decimal ViewBlock = 0;
                    decimal PerformanceRange = 0;
                    decimal HigherPerformanceRange = 0;
                    decimal LowerPerformanceRange = 0;
                    var Performance = "";
                    var ViewerStrength = "";
                    for (int i = 0; i < secondList.Count (); i++) {
                        // TotlaViewCount += secondList[i].ViewCount.Value;
                        TotlaViewCount = TotlaViewCount + secondList[i].ViewCount.Value;
                    }

                    if (secondList.Count () == 0) {
                        ComparativeInterest = 0;
                    } else {
                        var count = secondList.Count ();
                        var ComparativeInterest_Test = Math.Ceiling ((TotlaViewCount) / (count));
                        ComparativeInterest = Convert.ToInt16 (ComparativeInterest_Test);
                    }

                    ViewBlock = Math.Ceiling (Convert.ToDecimal (item.ViewCount.Value) / ViewBlockSize);
                    PerformanceRange = ViewBlock + BlockDiff;
                    HigherPerformanceRange = item.ViewCount.Value + PerformanceRange;
                    LowerPerformanceRange = item.ViewCount.Value - PerformanceRange;

                    if (ComparativeInterest > HigherPerformanceRange) {
                        Performance = "Under average";
                    } else if (ComparativeInterest >= LowerPerformanceRange) {
                        Performance = "Average";
                    } else {
                        Performance = "Above average";
                    }

                    if (Performance == "Above average" && item.Ranked > 0) {
                        ViewerStrength = "Strong";
                    } else if (Performance == "Under average" && item.Ranked < 0) {
                        ViewerStrength = "Weak";
                    } else if (Performance == "Under average" && item.Ranked == 0) {
                        ViewerStrength = "Weak";
                    } else if (Performance == "Above average" && item.Ranked == 0) {
                        ViewerStrength = "Strong";
                    } else {
                        ViewerStrength = "Average";
                    }

                    if (FlowInterestType.Daily.ToString () == flowInterestType) {
                        TimeWeightedPropertyFlowInterestDaily timeWeightedPropertyFlowInterestDailyObj = new TimeWeightedPropertyFlowInterestDaily ();
                        timeWeightedPropertyFlowInterestDailyObj.PropertyDetailId = item.PropertyDetailId;
                        timeWeightedPropertyFlowInterestDailyObj.Ranking = item.Ranked;
                        timeWeightedPropertyFlowInterestDailyObj.ComparativeInterest = Convert.ToInt16 (ComparativeInterest);
                        timeWeightedPropertyFlowInterestDailyObj.ViewBlock = Convert.ToInt16 (ViewBlock);
                        timeWeightedPropertyFlowInterestDailyObj.PerformanceRange = Convert.ToInt16 (PerformanceRange);
                        timeWeightedPropertyFlowInterestDailyObj.HigherPerformanceRange = Convert.ToInt16 (HigherPerformanceRange);
                        timeWeightedPropertyFlowInterestDailyObj.LowerPerformanceRange = Convert.ToInt16 (LowerPerformanceRange);
                        timeWeightedPropertyFlowInterestDailyObj.Performance = Performance;
                        timeWeightedPropertyFlowInterestDailyObj.ViewerStrength = ViewerStrength;
                        List<Property> Last90Views = new List<Property> ();
                        if (RankedList.Count > 0) {
                            Last90Views = RankedList[0].Last90Views;
                        }
                        var LastViewedObj = Last90Views.Where (t => t.PropertyDetailId == item.PropertyDetailId).FirstOrDefault ();
                        if (LastViewedObj != null) {
                            timeWeightedPropertyFlowInterestDailyObj.ViewCount = Convert.ToInt32 (LastViewedObj.ViewCount);
                            if (timeWeightedPropertyFlowInterestDailyObj.Ranking > 0 && timeWeightedPropertyFlowInterestDailyObj.ViewCount > 1) {
                                timeWeightedPropertyFlowInterestDailyObj.RankingStatus = "hot";
                            } else if (timeWeightedPropertyFlowInterestDailyObj.Ranking < 0) {
                                timeWeightedPropertyFlowInterestDailyObj.RankingStatus = "cool";
                            } else {
                                timeWeightedPropertyFlowInterestDailyObj.RankingStatus = "stable";
                            }
                        }

                        var dataDaily = _timeWeightedPropertyFlowInterestDailyService.CheckLast28DaysExistProperty (timeWeightedPropertyFlowInterestDailyObj);
                    }

                }

                return new OperationResult<List<PropertyViewFinalRankedVM>> (true, "", RankedList);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyViewFinalRankedVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        public async Task<OperationResult<List<PropertyViewFinalRankedVM>>> AddUpdateWeekly (string flowInterestType) {
            try {
                var totalProperties = 0;
                var totalPropertyViews = 0;
                var ViewBlockSize = 4;
                var BlockDiff = 0;
                List<PropertyViewFinalRankedVM> RankedList = new List<PropertyViewFinalRankedVM> ();
                var listData = await FlowInterest ();
                if (listData.Success == true) {
                    RankedList = listData.Model;
                }

                foreach (var item in RankedList) {
                    // Console.WriteLine (item);
                    var secondList = RankedList.Where (t => t.Status == item.Status).ToList ();
                    double TotlaViewCount = 0;
                    decimal ComparativeInterest = 0;
                    decimal ViewBlock = 0;
                    decimal PerformanceRange = 0;
                    decimal HigherPerformanceRange = 0;
                    decimal LowerPerformanceRange = 0;
                    var Performance = "";
                    var ViewerStrength = "";
                    for (int i = 0; i < secondList.Count (); i++) {
                        // TotlaViewCount += secondList[i].ViewCount.Value;
                        TotlaViewCount = TotlaViewCount + secondList[i].ViewCount.Value;
                    }

                    if (secondList.Count () == 0) {
                        ComparativeInterest = 0;
                    } else {
                        var count = secondList.Count ();
                        var ComparativeInterest_Test = Math.Ceiling ((TotlaViewCount) / (count));
                        ComparativeInterest = Convert.ToInt16 (ComparativeInterest_Test);
                    }

                    ViewBlock = Math.Ceiling (Convert.ToDecimal (item.ViewCount.Value) / ViewBlockSize);
                    PerformanceRange = ViewBlock + BlockDiff;
                    HigherPerformanceRange = item.ViewCount.Value + PerformanceRange;
                    LowerPerformanceRange = item.ViewCount.Value - PerformanceRange;

                    if (ComparativeInterest > HigherPerformanceRange) {
                        Performance = "Under average";
                    } else if (ComparativeInterest >= LowerPerformanceRange) {
                        Performance = "Average";
                    } else {
                        Performance = "Above average";
                    }

                    if (Performance == "Above average" && item.Ranked > 0) {
                        ViewerStrength = "Strong";
                    } else if (Performance == "Under average" && item.Ranked < 0) {
                        ViewerStrength = "Weak";
                    } else if (Performance == "Under average" && item.Ranked == 0) {
                        ViewerStrength = "Weak";
                    } else if (Performance == "Above average" && item.Ranked == 0) {
                        ViewerStrength = "Strong";
                    } else {
                        ViewerStrength = "Average";
                    }

                    if (FlowInterestType.Weekly.ToString () == flowInterestType) {

                        TimeWeightedPropertyFlowInterestWeekly timeWeightedPropertyFlowInterestWeeklyObj = new TimeWeightedPropertyFlowInterestWeekly ();
                        timeWeightedPropertyFlowInterestWeeklyObj.PropertyDetailId = item.PropertyDetailId;
                        timeWeightedPropertyFlowInterestWeeklyObj.Ranking = item.Ranked;
                        timeWeightedPropertyFlowInterestWeeklyObj.ComparativeInterest = Convert.ToInt16 (ComparativeInterest);
                        timeWeightedPropertyFlowInterestWeeklyObj.ViewBlock = Convert.ToInt16 (ViewBlock);
                        timeWeightedPropertyFlowInterestWeeklyObj.PerformanceRange = Convert.ToInt16 (PerformanceRange);
                        timeWeightedPropertyFlowInterestWeeklyObj.HigherPerformanceRange = Convert.ToInt16 (HigherPerformanceRange);
                        timeWeightedPropertyFlowInterestWeeklyObj.LowerPerformanceRange = Convert.ToInt16 (LowerPerformanceRange);
                        timeWeightedPropertyFlowInterestWeeklyObj.Performance = Performance;
                        timeWeightedPropertyFlowInterestWeeklyObj.ViewerStrength = ViewerStrength;
                        List<Property> Last90Views = new List<Property> ();
                        if (RankedList.Count > 0) {
                            Last90Views = RankedList[0].Last90Views;
                        }
                        var LastViewedObj = Last90Views.Where (t => t.PropertyDetailId == item.PropertyDetailId).FirstOrDefault ();
                        if (LastViewedObj != null) {
                            timeWeightedPropertyFlowInterestWeeklyObj.ViewCount = Convert.ToInt32 (LastViewedObj.ViewCount);
                            if (timeWeightedPropertyFlowInterestWeeklyObj.Ranking > 0 && timeWeightedPropertyFlowInterestWeeklyObj.ViewCount > 1) {
                                timeWeightedPropertyFlowInterestWeeklyObj.RankingStatus = "hot";
                            } else if (timeWeightedPropertyFlowInterestWeeklyObj.Ranking < 0) {
                                timeWeightedPropertyFlowInterestWeeklyObj.RankingStatus = "cool";
                            } else {
                                timeWeightedPropertyFlowInterestWeeklyObj.RankingStatus = "stable";
                            }
                        }
                        var dataWeekly = _timeWeightedPropertyFlowInterestWeeklyService.CheckPast4WeeksExistProperty (timeWeightedPropertyFlowInterestWeeklyObj);
                    }
                }

                return new OperationResult<List<PropertyViewFinalRankedVM>> (true, "", RankedList);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyViewFinalRankedVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        public async Task<OperationResult<List<PropertyViewFinalRankedVM>>> FlowInterest () {
            try {
                SearchVM searchVM = new SearchVM ();
                searchVM.NeLng = Convert.ToDecimal (174.83851678548584);
                searchVM.NeLat = Convert.ToDecimal (-36.81081809489699);
                searchVM.SwLng = Convert.ToDecimal (174.75860841451416);
                searchVM.SwLat = Convert.ToDecimal (-36.838712362984914);

                // Shraddha pc Lat-long
                // searchVM.NeLng = Convert.ToDecimal (174.81289632497558);
                // searchVM.NeLat = Convert.ToDecimal (-36.815628176897064);
                // searchVM.SwLng = Convert.ToDecimal (174.7842288750244);
                // searchVM.SwLat = Convert.ToDecimal (-36.83390373189648);

                searchVM.From = 0;
                searchVM.To = 28;

                var Last90Views = _propertyCrudDataService.GetTimeWeightedLast90View (searchVM);

                List<int> viewPropertyList = new List<int> ();
                var totalProperties = 0;
                var totalPropertyViews = 0;
                List<PropertyFlowInterest> PropertyFlowInterests = new List<PropertyFlowInterest> ();

                if (Last90Views != null) {
                    viewPropertyList = Last90Views.Select (t => t.PropertyDetailId).Distinct ().ToList ();
                    totalProperties = Last90Views.Select (t => t.PropertyDetailId).Distinct ().ToList ().Count ();
                }
                totalPropertyViews = Last90Views.Count ();

                List<PropertyViewBlockVM> VIEW30List = new List<PropertyViewBlockVM> ();
                List<PropertyViewBlockVM> VIEW60List = new List<PropertyViewBlockVM> ();
                List<PropertyViewBlockVM> BLOCK30List = new List<PropertyViewBlockVM> ();
                List<PropertyViewBlockVM> BLOCK60List = new List<PropertyViewBlockVM> ();
                List<PropertyRankedVM> Ranked30List = new List<PropertyRankedVM> ();
                List<PropertyRankedVM> Ranked60List = new List<PropertyRankedVM> ();
                List<PropertyViewFinalRankedVM> RankedList = new List<PropertyViewFinalRankedVM> ();
                var listofViewsDESC = Last90Views.OrderByDescending (t => t.ViewedDate).ToList ();
                if (totalProperties == 0 && totalPropertyViews == 0) {
                    RankedList = new List<PropertyViewFinalRankedVM> ();
                } else if (totalProperties == 2 && totalPropertyViews == 2) {
                    for (int i = 0; i < listofViewsDESC.Count (); i++) {
                        PropertyViewBlockVM VIEW30 = new PropertyViewBlockVM ();
                        PropertyViewBlockVM VIEW60 = new PropertyViewBlockVM ();
                        VIEW30.PropertyDetailId = listofViewsDESC[i].PropertyDetailId;
                        VIEW60.PropertyDetailId = listofViewsDESC[i].PropertyDetailId;
                        if (i == 0) {
                            VIEW30.ViewCount = 1;
                            VIEW60.ViewCount = 0;
                        } else {
                            VIEW30.ViewCount = 0;
                            VIEW60.ViewCount = 1;
                        }
                        VIEW30List.Add (VIEW30);
                        VIEW60List.Add (VIEW60);
                    }
                } else if (totalProperties >= 2 && totalPropertyViews == 3) {
                    for (int i = 0; i < listofViewsDESC.Count (); i++) {
                        PropertyViewBlockVM VIEW30 = new PropertyViewBlockVM ();
                        PropertyViewBlockVM VIEW60 = new PropertyViewBlockVM ();
                        VIEW30.PropertyDetailId = listofViewsDESC[i].PropertyDetailId;
                        VIEW60.PropertyDetailId = listofViewsDESC[i].PropertyDetailId;
                        if (i == 0) {
                            VIEW30.ViewCount = 1;
                            VIEW60.ViewCount = 0;
                        } else {
                            VIEW30.ViewCount = 0;
                            VIEW60.ViewCount = 1;
                        }
                        VIEW30List.Add (VIEW30);
                        VIEW60List.Add (VIEW60);
                    }
                } else if (totalProperties >= 2 && totalPropertyViews == 4) {
                    for (int i = 0; i < listofViewsDESC.Count (); i++) {
                        PropertyViewBlockVM VIEW30 = new PropertyViewBlockVM ();
                        PropertyViewBlockVM VIEW60 = new PropertyViewBlockVM ();
                        VIEW30.PropertyDetailId = listofViewsDESC[i].PropertyDetailId;
                        VIEW60.PropertyDetailId = listofViewsDESC[i].PropertyDetailId;
                        if (i == 0) {
                            VIEW30.ViewCount = 1;
                            VIEW60.ViewCount = 0;
                        } else {
                            VIEW30.ViewCount = 0;
                            VIEW60.ViewCount = 1;
                        }
                        VIEW30List.Add (VIEW30);
                        VIEW60List.Add (VIEW60);
                    }
                } else {
                    var PER33 = Math.Ceiling (((33.3) * totalPropertyViews) / 100);
                    var PER66 = Math.Floor (((66.6) * totalPropertyViews) / 100);
                    var listofViewsASC = Last90Views.OrderBy (t => t.ViewedDate);
                    var list1 = listofViewsDESC.Take (Convert.ToInt16 (PER33));
                    var list2 = listofViewsASC.Take (Convert.ToInt16 (PER66));
                    foreach (var item in list1) {
                        PropertyViewBlockVM VIEW30 = new PropertyViewBlockVM ();
                        VIEW30.PropertyDetailId = item.PropertyDetailId;
                        VIEW30.ViewCount = 1;
                        VIEW30List.Add (VIEW30);
                    }
                    foreach (var item in list2) {
                        PropertyViewBlockVM VIEW60 = new PropertyViewBlockVM ();
                        VIEW60.PropertyDetailId = item.PropertyDetailId;
                        VIEW60.ViewCount = 1;
                        VIEW60List.Add (VIEW60);
                    }
                    foreach (var item in VIEW60List) {
                        PropertyViewBlockVM VIEW30 = new PropertyViewBlockVM ();
                        VIEW30.PropertyDetailId = item.PropertyDetailId;
                        VIEW30.ViewCount = 0;
                        VIEW30List.Add (VIEW30);
                    }
                    foreach (var item in VIEW30List) {
                        PropertyViewBlockVM VIEW60 = new PropertyViewBlockVM ();
                        VIEW60.PropertyDetailId = item.PropertyDetailId;
                        VIEW60.ViewCount = 0;
                        VIEW60List.Add (VIEW60);
                    }
                }

                BLOCK30List = VIEW30List.GroupBy (o => o.PropertyDetailId)
                    .Select (grp => new PropertyViewBlockVM {
                        PropertyDetailId = grp.Key,
                            ViewCount = grp.Sum (o => o.ViewCount)
                    }).ToList ();

                BLOCK60List = VIEW60List.GroupBy (o => o.PropertyDetailId)
                    .Select (grp => new PropertyViewBlockVM {
                        PropertyDetailId = grp.Key,
                            ViewCount = grp.Sum (o => o.ViewCount)
                    }).ToList ();

                // Add logic for maximun Viewcount have lowest rank for RANK_30 List

                var max30ViewCount = BLOCK30List.Max (u => u.ViewCount);
                var count30 = 1;
                for (int x = max30ViewCount.Value; x >= 0; x--) {
                    var filteredList = BLOCK30List.Where (t => t.ViewCount == x).ToList ();
                    foreach (var item in filteredList) {
                        var isExistRecord = Ranked30List.Where (t => t.PropertyDetailId == item.PropertyDetailId).FirstOrDefault ();
                        if (isExistRecord == null) {
                            PropertyRankedVM Ranked30 = new PropertyRankedVM ();
                            Ranked30.PropertyDetailId = item.PropertyDetailId;
                            Ranked30.ViewCount = item.ViewCount;
                            Ranked30.Ranked = count30;
                            Ranked30List.Add (Ranked30);
                        }
                    }
                    if (filteredList.Count () > 0) {
                        count30++;
                    }
                }

                // Add logic for maximun Viewcount have lowest rank for RANK_30 List

                var max60ViewCount = BLOCK60List.Max (u => u.ViewCount);
                var count60 = 1;
                for (int y = max60ViewCount.Value; y >= 0; y--) {
                    var filteredList = BLOCK60List.Where (t => t.ViewCount == y).ToList ();
                    foreach (var item in filteredList) {
                        var isExistRecord = Ranked60List.Where (t => t.PropertyDetailId == item.PropertyDetailId).FirstOrDefault ();
                        if (isExistRecord == null) {
                            PropertyRankedVM Ranked60 = new PropertyRankedVM ();
                            Ranked60.PropertyDetailId = item.PropertyDetailId;
                            Ranked60.ViewCount = item.ViewCount;
                            Ranked60.Ranked = count60;
                            Ranked60List.Add (Ranked60);
                        }
                    }
                    if (filteredList.Count () > 0) {
                        count60++;
                    }
                }

                foreach (var rank30Obj in Ranked30List) {
                    var rank60Obj = Ranked60List.Where (t => t.PropertyDetailId == rank30Obj.PropertyDetailId).FirstOrDefault ();
                    var ViewCount = Last90Views.Where (t => t.PropertyDetailId == rank30Obj.PropertyDetailId).ToList ().Count ();
                    if (rank60Obj != null) {
                        var ranking = (rank60Obj.Ranked - rank30Obj.Ranked);
                        var Last90ViewObj = Last90Views.Where (t => t.PropertyDetailId == rank30Obj.PropertyDetailId).OrderByDescending (t => t.ViewedDate).FirstOrDefault ();
                        var rankedObj = new PropertyViewFinalRankedVM ();
                        rankedObj.PropertyDetailId = rank30Obj.PropertyDetailId;
                        rankedObj.Ranked30 = rank30Obj.Ranked;
                        rankedObj.Ranked60 = rank60Obj.Ranked;
                        rankedObj.Ranked = ranking;
                        rankedObj.ViewCount = ViewCount;
                        if (Last90ViewObj != null) {
                            rankedObj.LastViewed = Last90ViewObj.ViewedDate;
                        }
                        if (ranking > 0 && rankedObj.ViewCount > 1) {
                            rankedObj.Status = "hot";
                        } else if (ranking < 0) {
                            rankedObj.Status = "cool";
                        } else {
                            rankedObj.Status = "stable";
                        }
                        rankedObj.Last90Views = Last90Views;
                        RankedList.Add (rankedObj);
                    }
                }

                RankedList = RankedList.OrderByDescending (t => t.Ranked).ToList ();
                return new OperationResult<List<PropertyViewFinalRankedVM>> (true, "", RankedList);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyViewFinalRankedVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
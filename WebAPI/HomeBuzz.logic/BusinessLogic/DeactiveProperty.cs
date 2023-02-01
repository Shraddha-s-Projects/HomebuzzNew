using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.helper;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;

namespace HomeBuzz.logic {
    public class DeactiveProperty {

        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyOfferService _propertyOfferService;
        private readonly IPropertyClaimService _propertyClaimService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;
        private readonly IPropertyLikeService _propertyLikeService;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IPropertyImageService _propertyImageService;
        private readonly IPropertyNotifyService _propertyNotifyService;
        private readonly IUserService _userService;
        private readonly IPropertyFlowInterestDailyService _propertyFlowInterestDailyService;
        private readonly IPropertyFlowInterestHourlyService _propertyFlowInterestHourlyService;
        private readonly IPropertyFlowInterestWeeklyService _propertyFlowInterestWeeklyService;
         private readonly ITimeWeightedPropertyFlowInterestHourlyService _timeWeightedPropertyFlowInterestHourlyService;
        private readonly ITimeWeightedPropertyFlowInterestDailyService _timeWeightedPropertyFlowInterestDailyService;
        private readonly ITimeWeightedPropertyFlowInterestWeeklyService _timeWeightedPropertyFlowInterestWeeklyService;
        private readonly IEmailTemplateService _emailTemplateService;
        private PropertyOfferMail propertyOfferMail;
        private PropertyNotifyMail propertyNotifyMail;
        //    private SendEmail sendEmail;

        private ErrorLogService errorlogservice;

        public DeactiveProperty (
            IPropertyDetailService propertyDetailService,
            IPropertyOfferService propertyOfferService,
            IPropertyClaimService propertyClaimService,
            IPropertyCrudDataService propertyCrudDataService,
            IPropertyLikeService propertyLikeService,
            IPropertyViewService propertyViewService,
            IPropertyImageService propertyImageService,
            IPropertyNotifyService propertyNotifyService,
            IPropertyFlowInterestHourlyService propertyFlowInterestHourlyService,
            IPropertyFlowInterestDailyService propertyFlowInterestDailyService,
            IPropertyFlowInterestWeeklyService propertyFlowInterestWeeklyService,
            ITimeWeightedPropertyFlowInterestHourlyService timeWeightedPropertyFlowInterestHourlyService,
            ITimeWeightedPropertyFlowInterestDailyService timeWeightedPropertyFlowInterestDailyService,
            ITimeWeightedPropertyFlowInterestWeeklyService timeWeightedPropertyFlowInterestWeeklyService,
            IUserService userService,
            IEmailTemplateService emailTemplateService,
            HomeBuzzContext context
        ) {
            _propertyCrudDataService = propertyCrudDataService;
            _propertyDetailService = propertyDetailService;
            _propertyOfferService = propertyOfferService;
            _propertyClaimService = propertyClaimService;
            _propertyLikeService = propertyLikeService;
            _propertyViewService = propertyViewService;
            _propertyImageService = propertyImageService;
            _propertyNotifyService = propertyNotifyService;
            _userService = userService;
            _propertyFlowInterestHourlyService = propertyFlowInterestHourlyService;
            _propertyFlowInterestDailyService = propertyFlowInterestDailyService;
            _propertyFlowInterestWeeklyService = propertyFlowInterestWeeklyService;
            _timeWeightedPropertyFlowInterestHourlyService = timeWeightedPropertyFlowInterestHourlyService;
            _timeWeightedPropertyFlowInterestDailyService = timeWeightedPropertyFlowInterestDailyService;
            _timeWeightedPropertyFlowInterestWeeklyService = timeWeightedPropertyFlowInterestWeeklyService;
            _emailTemplateService = emailTemplateService;
            propertyOfferMail = new PropertyOfferMail (userService, emailTemplateService, context);
            propertyNotifyMail = new PropertyNotifyMail (userService, emailTemplateService, context);
            //   errorlogservice = new ErrorLogService (context);
            //    sendEmail = new SendEmail (emailTemplateService);
        }

        public async Task<List<PropertyDetail>> GetAllDeActivateProperty () {
            var result = _propertyDetailService.GetAllDeActivateProperty (28);
            List<int> propertyDetailIds = new List<int> ();
            foreach (var item in result) {
                propertyDetailIds.Add (item.Id);
            }
            var propertyClaim = _propertyClaimService.GetAllPropertyClaimsInTimePeriod (propertyDetailIds);
            foreach (var claim in propertyClaim) {
                var removeClaim = _propertyClaimService.RemovePropertyClaim (claim);
            }

            var propertyImage = _propertyImageService.GetAllPropertyImageInTimePeriod (propertyDetailIds);
            foreach (var image in propertyImage) {
                var removeImage = _propertyImageService.RemovePropertyImage (image);
            }
            var propertyLike = _propertyLikeService.GetAllPropertyLikeInTimePeriod (propertyDetailIds);
            foreach (var like in propertyLike) {
                var removeLike = _propertyLikeService.RemoveProperty (like);
            }
            var propertyView = _propertyViewService.GetAllDeActivePropertyView (propertyDetailIds);
            foreach (var view in propertyView) {
                var removeView = _propertyViewService.RemovePropertyView (view);
            }
            var propertyOffers = _propertyOfferService.GetAllDeActivePropertyOffers (propertyDetailIds);
            foreach (var offer in propertyOffers) {
                PropertyOfferVM propertyOffer = new PropertyOfferVM ();
                propertyOffer.PropertyDetailId = offer.PropertyDetailId.Value;
                var address = _propertyCrudDataService.GetPropertyCrudDataByPropertyDetailId (offer.PropertyDetailId.Value).Address;
                propertyOffer.UserId = offer.UserId.Value;
                propertyOffer.OfferingAmount = offer.OfferingAmount;
                propertyOffer.Id = offer.Id;
                propertyOffer.Address = address;
                var sendoffermail = await propertyOfferMail.ExpireOfferMail (propertyOffer);
                var removePropOffer = _propertyOfferService.RemovePropertyOffer (offer);
            }
            var propertyNotifies = _propertyNotifyService.GetAllDeActivePropertyNotify (propertyDetailIds);
            foreach (var notify in propertyNotifies) {
                var removeView = _propertyNotifyService.RemovePropertyNotify (notify);
            }
            var propertyCrudData = _propertyCrudDataService.GetAllPropertyCrudDataInTimePeriod (propertyDetailIds);
            foreach (var crudData in propertyCrudData) {
                var removeCrudData = _propertyCrudDataService.RemovePropertyCrudData (crudData);
            }

            var propertyFlowInterestHourly = _propertyFlowInterestHourlyService.GetAllDeActivePropertyFlowInterestHourly (propertyDetailIds);
            foreach (var prop in propertyFlowInterestHourly) {
                var removePropFlowInterest = _propertyFlowInterestHourlyService.RemovePropertyFlowInterestHourly (prop);
            }

            var propertyFlowInterestDaily = _propertyFlowInterestDailyService.GetAllDeActivePropertyFlowInterestDaily (propertyDetailIds);
            foreach (var prop in propertyFlowInterestDaily) {
                var removePropFlowInterest = _propertyFlowInterestDailyService.RemovePropertyFlowInterestDaily (prop);
            }

            var propertyFlowInterestWeekly = _propertyFlowInterestWeeklyService.GetAllDeActivePropertyFlowInterestWeekly (propertyDetailIds);
            foreach (var prop in propertyFlowInterestWeekly) {
                var removePropFlowInterest = _propertyFlowInterestWeeklyService.RemovePropertyFlowInterestWeekly (prop);
            }

            var timeWeightedPropertyFlowInterestHourly = _timeWeightedPropertyFlowInterestHourlyService.GetAllDeActiveTimeWeightedPropertyFlowInterestHourly (propertyDetailIds);
            foreach (var prop in timeWeightedPropertyFlowInterestHourly) {
                var removeTimeWeightedPropFlowInterestHourly = _timeWeightedPropertyFlowInterestHourlyService.RemoveTimeWeightedPropertyFlowInterestHourly (prop);
            }

            var timeWeightedPropertyFlowInterestDaily = _timeWeightedPropertyFlowInterestDailyService.GetAllDeActiveTimeWeightedPropertyFlowInterestDaily (propertyDetailIds);
            foreach (var prop in timeWeightedPropertyFlowInterestDaily) {
                var removeTimeWeightedPropFlowInterestDaily = _timeWeightedPropertyFlowInterestDailyService.RemoveTimeWeightedPropertyFlowInterestDaily (prop);
            }

            var timeWeightedPropertyFlowInterestWeekly = _timeWeightedPropertyFlowInterestWeeklyService.GetAllDeActiveTimeWeightedPropertyFlowInterestWeekly (propertyDetailIds);
            foreach (var prop in timeWeightedPropertyFlowInterestWeekly) {
                var removeTimeWeightedPropFlowInterestWeekly = _timeWeightedPropertyFlowInterestWeeklyService.RemoveTimeWeightedPropertyFlowInterestWeekly (prop);
            }

            foreach (var propertyDetail in result) {
                var removepropDetail = _propertyDetailService.RemovePropertyDetail (propertyDetail);
            }
            return result;
        }

        public async Task<List<PropertyOffer>> GetAllDeActivePropertyOffers () {
            var result = _propertyOfferService.GetAllPropertyOfferssInTimePeriod (28);
            foreach (var item in result) {
                PropertyOfferVM propertyOffer = new PropertyOfferVM ();
                propertyOffer.PropertyDetailId = item.PropertyDetailId.Value;
                var address = _propertyCrudDataService.GetPropertyCrudDataByPropertyDetailId (item.PropertyDetailId.Value).Address;
                propertyOffer.UserId = item.UserId.Value;
                propertyOffer.OfferingAmount = item.OfferingAmount;
                propertyOffer.Id = item.Id;
                propertyOffer.Address = address;
                var sendoffermail = await propertyOfferMail.ExpireOfferMail (propertyOffer);
                var removePropOffer = _propertyOfferService.RemovePropertyOffer (item);
            }
            return result;
        }

        public async Task<List<PropertyDetail>> GetAllPropertyNotify () {
            try {
                var SevenDaysPropertyDetail = _propertyDetailService.GetAllNotifyProperty (7);
                var ForteenDaysPropertyDetail = _propertyDetailService.GetAllNotifyProperty (14);
                var TwentyOnePropertyDetail = _propertyDetailService.GetAllNotifyProperty (21);
                var TwentyEightPropertyDetail = _propertyDetailService.GetAllNotifyProperty (28);
                foreach (var item in SevenDaysPropertyDetail) {
                    var propertyNotifyList = _propertyNotifyService.GetAllPropertyNotifyByDetailId (item.Id);
                    foreach (var notify in propertyNotifyList) {
                        PropertyNotifyVM propertyNotify = new PropertyNotifyVM ();
                        propertyNotify.PropertyDetailId = item.Id;
                        PropertyDetail propertyDetail = _propertyDetailService.GetMany (t => t.Id == item.Id).Result.FirstOrDefault ();
                        PropertyCrudData propertyCrudData = _propertyCrudDataService.GetMany (t => t.PropertyDetailId == item.Id).Result.FirstOrDefault ();
                        propertyNotify.UserId = notify.UserId;
                        if (propertyDetail != null) {
                            propertyNotify.Day = propertyDetail.Day;
                            propertyNotify.Time = propertyDetail.Time;
                            propertyNotify.OpenedDate = propertyDetail.OpenedDate.Value;
                        }
                        if (propertyCrudData != null) {
                            propertyNotify.Address = propertyCrudData.Address;
                        }
                        var sendoffermail = await propertyNotifyMail.SentNotifyEmail (propertyNotify);
                        Console.WriteLine ("SevenDaysPropertyDetail Email sent......");
                    }
                }
                foreach (var item in ForteenDaysPropertyDetail) {
                    var propertyNotifyList = _propertyNotifyService.GetAllPropertyNotifyByDetailId (item.Id);
                    foreach (var notify in propertyNotifyList) {
                        PropertyNotifyVM propertyNotify = new PropertyNotifyVM ();
                        propertyNotify.PropertyDetailId = item.Id;
                        propertyNotify.UserId = notify.UserId;
                        PropertyDetail propertyDetail = _propertyDetailService.GetMany (t => t.Id == item.Id).Result.FirstOrDefault ();
                        PropertyCrudData propertyCrudData = _propertyCrudDataService.GetMany (t => t.PropertyDetailId == item.Id).Result.FirstOrDefault ();
                        propertyNotify.UserId = notify.UserId;
                        if (propertyDetail != null) {
                            propertyNotify.Day = propertyDetail.Day;
                            propertyNotify.Time = propertyDetail.Time;
                            propertyNotify.OpenedDate = propertyDetail.OpenedDate.Value;
                        }
                        if (propertyCrudData != null) {
                            propertyNotify.Address = propertyCrudData.Address;
                        }

                        var sendoffermail = await propertyNotifyMail.SentNotifyEmail (propertyNotify);
                        Console.WriteLine ("ForteenDaysPropertyDetail Email sent......");
                    }
                }
                foreach (var item in TwentyOnePropertyDetail) {
                    var propertyNotifyList = _propertyNotifyService.GetAllPropertyNotifyByDetailId (item.Id);
                    foreach (var notify in propertyNotifyList) {
                        PropertyNotifyVM propertyNotify = new PropertyNotifyVM ();
                        propertyNotify.PropertyDetailId = item.Id;
                        propertyNotify.UserId = notify.UserId;
                        PropertyDetail propertyDetail = _propertyDetailService.GetMany (t => t.Id == item.Id).Result.FirstOrDefault ();
                        PropertyCrudData propertyCrudData = _propertyCrudDataService.GetMany (t => t.PropertyDetailId == item.Id).Result.FirstOrDefault ();
                        propertyNotify.UserId = notify.UserId;
                        if (propertyDetail != null) {
                            propertyNotify.Day = propertyDetail.Day;
                            propertyNotify.Time = propertyDetail.Time;
                            propertyNotify.OpenedDate = propertyDetail.OpenedDate.Value;
                        }
                        if (propertyCrudData != null) {
                            propertyNotify.Address = propertyCrudData.Address;
                        }
                        var sendoffermail = await propertyNotifyMail.SentNotifyEmail (propertyNotify);
                        Console.WriteLine ("TwentyOnePropertyDetail Email sent......");
                    }
                }
                foreach (var item in TwentyEightPropertyDetail) {
                    var propertyNotifyList = _propertyNotifyService.GetAllPropertyNotifyByDetailId (item.Id);
                    foreach (var notify in propertyNotifyList) {
                        PropertyNotifyVM propertyNotify = new PropertyNotifyVM ();
                        propertyNotify.PropertyDetailId = item.Id;
                        propertyNotify.UserId = notify.UserId;
                        PropertyDetail propertyDetail = _propertyDetailService.GetMany (t => t.Id == item.Id).Result.FirstOrDefault ();
                        PropertyCrudData propertyCrudData = _propertyCrudDataService.GetMany (t => t.PropertyDetailId == item.Id).Result.FirstOrDefault ();
                        propertyNotify.UserId = notify.UserId;
                        if (propertyDetail != null) {
                            propertyNotify.Day = propertyDetail.Day;
                            propertyNotify.Time = propertyDetail.Time;
                            propertyNotify.OpenedDate = propertyDetail.OpenedDate.Value;
                        }
                        if (propertyCrudData != null) {
                            propertyNotify.Address = propertyCrudData.Address;
                        }
                        var sendoffermail = await propertyNotifyMail.SentNotifyEmail (propertyNotify);
                        Console.WriteLine ("TwentyEightPropertyDetail Email sent......");
                    }
                }

                return TwentyEightPropertyDetail;
            } catch (System.Exception ex) {

                throw ex;
            }

        }

    }
}
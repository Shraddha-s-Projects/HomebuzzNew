using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/SubscriptionPlan")]
    public class SubscriptionPlanController : Controller {
        private ErrorLogService errorlogservice;
        private readonly ISubscriptionPlanService _subscriptionPlanService;
        private readonly ISubscriptionPlanDetailService _subscriptionPlanDetailService;

        #region 'Constructor'
        public SubscriptionPlanController (ISubscriptionPlanService subscriptionPlanService,
            HomeBuzzContext context,
            ISubscriptionPlanDetailService subscriptionPlanDetailService) {
            _subscriptionPlanService = subscriptionPlanService;
            _subscriptionPlanDetailService = subscriptionPlanDetailService;
            errorlogservice = new ErrorLogService (context);
        }
        #endregion

        [AllowAnonymous]
        [HttpGet ("GetAllPlan")]
        public async Task<OperationResult<List<SubscriptionPlanVM>>> GetAllPlan () {
            try {
                List<SubscriptionPlanVM> subscriptionPlanVMList = new List<SubscriptionPlanVM> ();
                var planList = _subscriptionPlanService.GetAllSubscriptionPlan ();
                foreach (var item in planList) {
                    SubscriptionPlanVM subscriptionPlanVM = new SubscriptionPlanVM ();
                    subscriptionPlanVM.Id = item.Id;
                    subscriptionPlanVM.Name = item.Name;
                    subscriptionPlanVM.CreatedOn = item.CreatedOn;
                    subscriptionPlanVM.UpdatedOn = item.UpdatedOn;
                    subscriptionPlanVM.IsDeleted = item.IsDeleted;
                    var planDetail = _subscriptionPlanDetailService.GetlSubscriptionPlanDetailByPlanId (item.Id);
                    if (planDetail != null) {
                        subscriptionPlanVM.SubscriptionPlanDetail = planDetail;
                    }
                    subscriptionPlanVMList.Add (subscriptionPlanVM);
                }

                return new OperationResult<List<SubscriptionPlanVM>> (true, "", subscriptionPlanVMList);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<SubscriptionPlanVM>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
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

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/PropertyLike")]
    [Authorize]
    public class PropertyLikeController : Controller {
        private readonly IPropertyLikeService _propertyLikeService;
        private readonly IPropertyDetailService _propertyDetailService;
        private readonly IPropertyDataService _propertyDataService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;

        private ErrorLogService errorlogservice;

        #region 'Constructor'
        public PropertyLikeController (IPropertyLikeService propertyLikeService, HomeBuzzContext context,
            IPropertyDetailService propertyDetailService,
            IPropertyDataService propertyDataService, IPropertyCrudDataService propertyCrudDataService) {
            _propertyLikeService = propertyLikeService;
            _propertyDetailService = propertyDetailService;
            _propertyDataService = propertyDataService;
            _propertyCrudDataService = propertyCrudDataService;
            errorlogservice = new ErrorLogService (context);
        }
        #endregion

        #region 'property like/dislike'
        /// <summary>
        /// This API called when user do sign up.
        /// </summary>
        /// <param name="Model"> User Model</param>
        /// <returns></returns>
        // [AllowAnonymous]
        [HttpPost ("LikeDislikeProperty")]
        public async Task<OperationResult<PropertyLikeVM>> LikeDislike ([FromBody] PropertyLike Model) {
            PropertyLike obj = new PropertyLike ();
            try {
                var result = _propertyLikeService.LikeDislikeProperty (Model);

                return new OperationResult<PropertyLikeVM> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<PropertyLikeVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpPost ("UserPropertyLikes")]
        public async Task<OperationResult<List<UserPropertyLikes>>> UserPropertyLikes (int userId) {
            try {
                var result = _propertyLikeService.GetUserPropertyLikes (userId);

                //var offers = _propertyOfferService.GetUserPropertyOffers (userId);

                return new OperationResult<List<UserPropertyLikes>> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<UserPropertyLikes>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpPost ("UserInfo")]
        public async Task<OperationResult<List<UserPropertyInfo>>> UserInfo (int userId) {
            try {
                var result = _propertyLikeService.GetUserPropertyInfo (userId);

                //var offers = _propertyOfferService.GetUserPropertyOffers (userId);

                return new OperationResult<List<UserPropertyInfo>> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<UserPropertyInfo>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        #endregion
    }
}
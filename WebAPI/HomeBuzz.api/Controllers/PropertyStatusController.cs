using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/PropertyStatus")]
    public class PropertyStatusController : Controller {

        private readonly IPropertyStatusService _propertyStatusService;
        private ErrorLogService errorlogservice;

        #region 'Constructor'
        public PropertyStatusController (IPropertyStatusService propertyStatusService, HomeBuzzContext context) {
            _propertyStatusService = propertyStatusService;
            errorlogservice = new ErrorLogService (context);
        }
        #endregion

        [AllowAnonymous]
        [HttpGet ("GetAllPropertyStatus")]
        public async Task<OperationResult<List<PropertyStatus>>> GetAllPropertyStatus () {
            try {
                var result = _propertyStatusService.GetAllPropertyStatus ();
                return new OperationResult<List<PropertyStatus>> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<PropertyStatus>> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
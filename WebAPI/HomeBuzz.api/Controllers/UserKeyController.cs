using System;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/UserKey")]
    public class UserKeyController : Controller {

        private readonly IUserKeyMapService _userKeyMapService;
        private ErrorLogService errorlogservice;

        public UserKeyController (
            IUserKeyMapService userKeyMapService,
            HomeBuzzContext context
        ) {
            _userKeyMapService = userKeyMapService;
            errorlogservice = new ErrorLogService (context);
        }

        [AllowAnonymous]
        [HttpPost ("AddUpdate")]
        public async Task<OperationResult<UserKeyMap>> AddUpdate ([FromBody] UserKeyMap Model) {
            try {
                UserKeyMap userKeyMapObj = new UserKeyMap ();
                if (Model != null) {
                    userKeyMapObj = _userKeyMapService.CheckInsertOrUpdate (Model);
                }
                return new OperationResult<UserKeyMap> (true, "", userKeyMapObj);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<UserKeyMap> (false, CommonMessage.DefaultErrorMessage);
            }
        }

    }
}
using System;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.helper;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [AllowAnonymous]
    [Route ("api/[controller]")]
    public class CommonController : Controller {
        private readonly HomeBuzzContext _context;
        private readonly ErrorLogService errorlogservice;
        private IHostingEnvironment _hostingEnvironment { get; set; }

        private CommonFunction commonFunction;

        public CommonController (HomeBuzzContext context, IHostingEnvironment hostingEnvironment) {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            CommonMessage.CurrentURL = HomeBuzzContext.CurrentURL;
            commonFunction = new CommonFunction ();
        }

        [HttpGet ("GetStringHash/{str}")]
        public OperationResult GetStringHash (string str) {
            try {
                return new OperationResult (true, ShaHash.GetHash (str));
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpGet ("GetPWHash/{str}")]
        public OperationResult GetPWHash (string str) {
            try {
                return new OperationResult (true, ShaHash.GetStringHash (str));
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [HttpPost ("ValidateCapchaResponse")]
        public async Task<OperationResult<Recapcha>> ValidateCapchaResponse ([FromBody] Recapcha model) {
            try {
                var result = await commonFunction.ValidateCapchaResponse (model);
                return new OperationResult<Recapcha> (true, "", result);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<Recapcha> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.jwt.authentication;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HomeBuzz.api.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class TokenController : Controller
    {
        private string email = "";
        private long userId = 0;
        private string role = "";

        private readonly HomeBuzzContext _context;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly IPropertyViewService _propertyViewService;
        private readonly IUserRolesService _userRolesService;

        ErrorLogService errorlogservice;

        public TokenController(HomeBuzzContext context, IPropertyViewService propertyViewService,
        IUserRolesService userRolesService)
        {
            _context = context;
            _propertyViewService = propertyViewService;
            _userRolesService = userRolesService;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
            errorlogservice = new ErrorLogService(context);
        }

        /// <summary>
        /// This API provides JWT token and authenticate the User login.
        /// </summary>
        /// <param name="Model"> User Model</param>
        /// <returns></returns>
        [HttpPost]
        public async Task Authenticate([FromBody] UserVM Model)
        {
            try
            {
                var request = HttpContext.Request;
                var ip = request.HttpContext.Connection.RemoteIpAddress;
                var ua = Request.Headers["User-Agent"].ToString();
                UserAgent uag = new UserAgent(ua);
                //    HttpCookie cookie = new HttpCookie("home_viewer");

                var User = _context.User
                    .Where(m => (m.Email.Trim().ToLower() == Model.UserName || m.UserName.ToLower() == Model.UserName) &&
                       m.Password == Model.Password && m.IsDeleted == false
                    ).FirstOrDefault();

                // If user not found
                if (User == null)
                {
                    Response.StatusCode = 401;
                    var InValidResponse = new
                    {
                        statusCode = 401,
                        errorCode = "1",
                        errorCase = "invalid credential",
                    };
                    Response.ContentType = "application/json";
                    await Response.WriteAsync(JsonConvert.SerializeObject(InValidResponse, _serializerSettings));
                    return;
                }

                // If user's email is not verified
                if (!User.IsEmailVerified)
                {
                    Response.StatusCode = 401;
                    var EmailNotVerifiedResponse = new
                    {
                        statusCode = 401,
                        errorCode = "2",
                        errorCase = "email not verified",
                    };
                    Response.ContentType = "application/json";
                    await Response.WriteAsync(JsonConvert.SerializeObject(EmailNotVerifiedResponse, _serializerSettings));
                    return;
                }

                // If user is inactive or deleted
                if (!User.IsActive || User.IsDeleted)
                {
                    Response.StatusCode = 401;
                    var EmailNotVerifiedResponse = new
                    {
                        statusCode = 401,
                        errorCode = "4",
                        errorCase = "Either user is inactive or deleted.",
                    };
                    Response.ContentType = "application/json";
                    await Response.WriteAsync(JsonConvert.SerializeObject(EmailNotVerifiedResponse, _serializerSettings));
                    return;
                }

                this.email = User.Email;
                this.userId = User.UserId;

                // Generate token
                var token = new JwtTokenBuilder()
                    .AddClaims(GetClaim())
                    .Build();

                var model = new LoginVM();
                model.EncryptedUserId = this.userId.ToString();
                model.UserName = User.FirstName;
                model.RoleId = User.RoleId;
                if(User.RoleId != null){
                  var RoleObj = _userRolesService.GetUserRoleById(model.RoleId.Value);
                  if(RoleObj != null){
                      model.RoleName = RoleObj.Role;
                  }
                 }
                TimeSpan interval = new TimeSpan(0, 5, 0);
                // List<PropertyViewListVM> propertyVMList = new List<PropertyViewListVM>();
                // IFormatProvider culture = new CultureInfo("en-US", true);
                // foreach (var item in Model.Homes)
                // {
                //     PropertyViewListVM propertyvm = new PropertyViewListVM();
                //     propertyvm.PropertyDetailId = Convert.ToInt32(item.Id);
                //     propertyvm.ViewDate = DateTime.ParseExact(item.ViewDate, "mm/dd/yyyy", culture);
                //     propertyvm.UserId = Convert.ToInt16(this.userId);
                //     propertyvm.UserKey = item.UserKey;
                //     propertyVMList.Add(propertyvm);
                // }
                // var result = _propertyViewService.CheckInsertOrUpdatePropertyView(propertyVMList);

                // var propertyViewObj = _propertyViewService.GetPropertyViewByUserId(User.UserId);
                // model.PropertyViwer = new List<PropertyViewerVM>();
                // foreach (var propView in propertyViewObj)
                // {
                //     PropertyViewerVM propertyViewer = new PropertyViewerVM();
                //     propertyViewer.PropertyDetailId = propView.PropertyDetailId;
                //     propertyViewer.ViewDate = propView.ViewDate;
                //     propertyViewer.UserKey = propView.UserKey;
                //     model.PropertyViwer.Add(propertyViewer);
                // }

                // model.PropertyDetailIds = _propertyViewService.GetPropertyViewByUserId(User.UserId).Select(t => t.PropertyDetailId).ToArray();

                var response = new
                {
                    access_token = token.Value,
                    expires_in = interval.TotalSeconds,
                    model = model
                };

                // Serialize and return the response
                Response.ContentType = "application/json";
                await Response.WriteAsync(JsonConvert.SerializeObject(response, _serializerSettings));
            }
            catch (Exception ex)
            {
                errorlogservice.LogException(ex);
                Response.StatusCode = 400;
                var EmailNotVerifiedResponse = new
                {
                    statusCode = 400,
                    errorCode = "4",
                    errorCase = CommonMessage.DefaultErrorMessage,
                };
                Response.ContentType = "application/json";
                await Response.WriteAsync(JsonConvert.SerializeObject(EmailNotVerifiedResponse, _serializerSettings));
                return;
            }
        }

        #region Private
        private Dictionary<string, string> GetClaim()
        {
            var claim = new Dictionary<string, string>();
            claim.Add("Email", this.email);
            claim.Add("Sid", this.userId.ToString());
            claim.Add("Role", this.role);
            return claim;
        }
        #endregion
    }
}
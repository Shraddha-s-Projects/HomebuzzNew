using System;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.data.ViewModels;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/Admin")]
    public class AdminController : Controller {
        private ErrorLogService errorlogservice;
        private readonly IUserService _userService;
        private readonly IUserRolesService _userRoleService;
        private readonly IPropertyDataService _propertyDataService;
        private readonly IPropertyCrudDataService _propertyCrudDataService;

        public AdminController (HomeBuzzContext context,
            IUserService userService,
            IUserRolesService userRoleService,
            IPropertyDataService propertyDataService,
            IPropertyCrudDataService propertyCrudDataService
        ) {
            _userService = userService;
            _userRoleService = userRoleService;
            _propertyDataService = propertyDataService;
            _propertyCrudDataService = propertyCrudDataService;
            errorlogservice = new ErrorLogService (context);
        }

        [Authorize]
        [HttpPost ("GetUsers")]
        public async Task<OperationResult<AdminUserVM>> GetUsers ([FromBody] AdminUserVM Model) {
            try {
                var RoleId = _userRoleService.GetUserRoleByName ("Customer").Id;
                Model.RoleId = RoleId;
                var result = _userService.GetUsersForAdmin (Model);

                return new OperationResult<AdminUserVM> (true, "", result);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminUserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("GetAgents")]
        public async Task<OperationResult<AdminUserVM>> GetAgents ([FromBody] AdminUserVM Model) {
            try {
                var RoleId = _userRoleService.GetUserRoleByName ("Agent").Id;
                var AgentAdminId = _userRoleService.GetUserRoleByName ("Agent_Admin").Id;
                Model.RoleId = RoleId;
                Model.AgentAdminId = AgentAdminId;
                var result = _userService.GetUsersForAdmin (Model);

                return new OperationResult<AdminUserVM> (true, "", result);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminUserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("GetProperties")]
        public async Task<OperationResult<AdminPropertyVM>> GetProperties ([FromBody] AdminPropertyVM Model) {
            try {

                var result = _propertyDataService.GetAdminProperties (Model);

                return new OperationResult<AdminPropertyVM> (true, "", result);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminPropertyVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("Update")]
        public async Task<OperationResult<AdminUserVM>> Update ([FromBody] AdminUserVM Model) {
            try {
                var ExistingUser = _userService.IsEmailCheckWithOtherUsers (Model.Email, Model.UserId);
                if (Model.PhoneNo != null && Model.PhoneNo != "") {
                    ExistingUser = _userService.IsPhoneNoCheckWithOtherUsers (Model.PhoneNo, Model.UserId);
                }
                if (ExistingUser == null) {
                    User userObj = new User ();
                    userObj.UserId = Model.UserId;
                    userObj.FirstName = Model.FirstName;
                    userObj.LastName = Model.LastName;
                    userObj.UserName = Model.UserName;
                    userObj.Email = Model.Email;
                    userObj.PhoneNo = Model.PhoneNo;
                    userObj.IsActive = Model.IsActive.Value;
                    var user = _userService.CheckAndUpdateUserForAdmin (userObj);
                    return new OperationResult<AdminUserVM> (true, "", Model);
                } else {
                    return new OperationResult<AdminUserVM> (false, CommonMessage.EmailOrPhoneNoExist);
                }

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminUserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("RemoveUser")]
        public async Task<OperationResult<AdminUserVM>> RemoveUser ([FromBody] AdminUserVM Model) {
            try {
                var user = _userService.RemoveUser (Model.UserId);
                return new OperationResult<AdminUserVM> (true, "", Model);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminUserVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("UpdateProperty")]
        public async Task<OperationResult<AdminPropertyVM>> UpdateProperty ([FromBody] AdminPropertyVM Model) {
            try {
                if (Model.IsActive == false) {
                    PropertyData property = new PropertyData ();
                    property.Id = Model.Id;
                    property.Address = Model.Address;
                    property.Suburb = Model.Suburb;
                    property.City = Model.City;
                    property.HomebuzzEstimate = Model.HomebuzzEstimate;
                    property.Bedrooms = Model.Bedrooms;
                    property.Bathrooms = Model.Bathrooms;
                    property.Landarea = Model.Landarea;
                    property.CarSpace = Model.CarSpace;
                    property.Latitude = Convert.ToDecimal (Model.Latitude);
                    property.Longitude = Convert.ToDecimal (Model.Longitude);

                    var user = _propertyDataService.CheckAndUpdateInActivePropertyForAdmin (property);
                } else {
                    PropertyCrudData property = new PropertyCrudData ();
                    property.Id = Model.Id;
                    property.Address = Model.Address;
                    property.Suburb = Model.Suburb;
                    property.City = Model.City;
                    property.HomebuzzEstimate = Model.HomebuzzEstimate;
                    property.Bedrooms = Model.Bedrooms;
                    property.Bathrooms = Model.Bathrooms;
                    property.Landarea = Model.Landarea;
                    property.CarSpace = Model.CarSpace;
                    property.Latitude = Convert.ToDecimal (Model.Latitude);
                    property.Longitude = Convert.ToDecimal (Model.Longitude);

                    var user = _propertyCrudDataService.CheckAndUpdateActivePropertyForAdmin (property);
                }

                return new OperationResult<AdminPropertyVM> (true, "", Model);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminPropertyVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }

        [Authorize]
        [HttpPost ("RemoveProperty")]
        public async Task<OperationResult<AdminPropertyVM>> RemoveProperty ([FromBody] AdminPropertyVM Model) {
            try {
                // if (Model.IsActive == true) {

                // } else {
                var existingProperty = _propertyDataService.GetMany (t => t.Id == Model.Id).Result.FirstOrDefault ();
                if (existingProperty != null) {
                    _propertyDataService.RemoveInActiveProperty (existingProperty);
                } else {
                    return new OperationResult<AdminPropertyVM> (false, CommonMessage.DefaultErrorMessage);
                }
                // }
                return new OperationResult<AdminPropertyVM> (true, "", Model);
            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<AdminPropertyVM> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}
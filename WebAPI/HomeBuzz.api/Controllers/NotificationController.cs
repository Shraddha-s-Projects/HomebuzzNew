using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.logic;
using HomeBuzz.logic.Common;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using WebSocketManager;

namespace HomeBuzz.api.Controllers
{
    [Produces("application/json")]
    // [Authorize]
    [Route("api/Notification")]
    public class NotificationController : Controller
    {
        #region 'Object Initialization'
        private readonly NotificationsMessageHandler _notificationsMessageHandler;
        private Notification notification;
        private ErrorLogService errorlogservice;
        private long userId = 0;
        #endregion

        #region 'Constructor'
        public NotificationController(NotificationsMessageHandler notificationsMessageHandler, HomeBuzzContext context, INotificationService notificationService)
        {
            notification = new Notification(notificationsMessageHandler, notificationService);
            errorlogservice = new ErrorLogService(context);
        }
        #endregion

        #region 'Notification API'
        [AllowAnonymous]
        [HttpGet("SendMessage")]
        public async Task SendMessage([FromQueryAttribute]string id)
        {
           
        }
        #endregion
    }
}
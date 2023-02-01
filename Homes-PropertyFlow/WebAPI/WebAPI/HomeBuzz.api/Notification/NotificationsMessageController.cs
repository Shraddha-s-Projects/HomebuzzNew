using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebSocketManager;
using Microsoft.AspNetCore.Authorization;
using HomeBuzz.data.Models;

namespace WebSocket.WebSocket
{
    [Route("api/[controller]")]
    public class NotificationsMessageController : Controller
    {
        private NotificationsMessageHandler _notificationsMessageHandler { get; set; }

        public NotificationsMessageController(NotificationsMessageHandler notificationsMessageHandler)
        {
            _notificationsMessageHandler = notificationsMessageHandler;
        }

        [AllowAnonymous]
        [HttpGet("SendMessage")]
        public async Task SendMessage([FromQueryAttribute]string message)
        {
            
          
        }
    }
}
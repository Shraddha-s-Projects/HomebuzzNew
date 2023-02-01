using HomeBuzz.data;
using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSocketManager;

namespace HomeBuzz.api
{
    public class Notification
    {
        #region 'Object Initialization'
        private readonly NotificationsMessageHandler _notificationsMessageHandler;
        private readonly INotificationService _notificationService;
        #endregion

        #region 'Constructor'
        public Notification(NotificationsMessageHandler notificationsMessageHandler, INotificationService notificationService)
        {
            _notificationsMessageHandler = notificationsMessageHandler;
            _notificationService = notificationService;
        }
        #endregion

        #region 'Send Function'
        
        #endregion
    }
}

using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace HomeBuzz.data
{
    public partial class NotificationService : ServiceBase<Notification>, INotificationService
    {
        public NotificationService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public Notification CheckInsertOrUpdate(Notification notification)
        {
            var existingItem = GetMany(t => t.NotificationId == notification.NotificationId).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateNotification(existingItem, notification);
            }
            else
            {
                return InsertNotification(notification);
            }
        }

        public Notification InsertNotification(Notification notification)
        {
            var newItem = Add(notification);
            SaveAsync();

            return newItem;
        }

        public Notification UpdateNotification(Notification existingItem, Notification notification)
        {
            existingItem.NotificationType = notification.NotificationType;
            existingItem.FromUserId = notification.FromUserId;
            existingItem.FromUserName = notification.FromUserName;
            existingItem.ToUserId = notification.ToUserId;
            existingItem.ToUserName = notification.ToUserName;
            existingItem.ToastContent = notification.ToastContent;
            existingItem.Description = notification.Description;
            existingItem.IsNotificationRead = notification.IsNotificationRead;
            existingItem.NotificationReadOn = notification.NotificationReadOn;

            UpdateAsync(existingItem, existingItem.NotificationId);
            SaveAsync();

            return existingItem;
        }

        public List<Notification> GetNotificationByUserId(long userId)
        {
            var notification = GetMany(t => t.ToUserId == userId && Convert.ToBoolean(t.IsDeleted) == false).Result.ToList();
            return notification;
        }

        public Notification GetNotificationByNotificationId(long notificationId)
        {
            var notification = GetMany(t => t.NotificationId == notificationId && Convert.ToBoolean(t.IsDeleted) == false).Result.FirstOrDefault();
            return notification;
        }
    }

    public partial interface INotificationService : IService<Notification>
    {
        Notification CheckInsertOrUpdate(Notification Notification);

        List<Notification> GetNotificationByUserId(long userId);

        Notification GetNotificationByNotificationId(long notificationId);
    }
}

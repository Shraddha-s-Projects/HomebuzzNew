using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class Notification
    {
        [Key, Required]
        public long NotificationId { get; set; }

        [StringLength(50)]
        public string NotificationType { get; set; }

        public long FromUserId { get; set; }

        public long ToUserId { get; set; }

        [StringLength(50)]
        public string FromUserName { get; set; }

        [StringLength(50)]
        public string ToUserName { get; set; }

        public string ToastContent { get; set; }

        public string Description { get; set; }

        public DateTime NotificationTime { get; set; } = DataUtility.GetCurrentDateTime();

        public Nullable<bool> IsNotificationRead { get; set; } = false;

        public Nullable<DateTime> NotificationReadOn { get; set; }

        public Nullable<bool> IsDeleted { get; set; } = false;

        public Nullable<DateTime> DeletedOn { get; set; }
    }
}

using HomeBuzz.data.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class NotificationCommon
    {
        public string NotificationType { get; set; }

        public Nullable<DateTime> NotificationTime { get; set; }
    }

    public class NotificationVM : NotificationCommon
    {
        public long NotificationId { get; set; }

        public long FromUserId { get; set; }

        public long ToUserId { get; set; }

        public string FromUserName { get; set; }

        public string ToUserName { get; set; }

        public string ToastContent { get; set; }

        public string Description { get; set; }

        public string String1 { get; set; }

        public Nullable<bool> IsNotificationRead { get; set; }

        public Nullable<DateTime> NotificationReadOn { get; set; }

        public Nullable<bool> IsDeleted { get; set; }

        public Nullable<DateTime> DeletedOn { get; set; }
    }

    public class LinkNotificationResult : CommonResponse
    {
        public long LinkNotificationId { get; set; }
        
        public string InfoCode { get; set; }

        public long TableRecordId { get; set; }

        public string String1 { get; set; }

        public string String2 { get; set; }

        public string String3 { get; set; }

        public long FromUserId { get; set; }

        public string FromUserName { get; set; }

        public long ToUserId { get; set; }

        public string ToUserName { get; set; }

        public string ToastContent { get; set; }

        public string Description { get; set; }

        public bool IsSent { get; set; }

        public DateTime SentOn { get; set; }

        public Nullable<bool> IsDelevered { get; set; }

        public Nullable<DateTime> DeleveredOn { get; set; }

        public Nullable<bool> IsRead { get; set; }

        public Nullable<DateTime> ReadOn { get; set; }

        public Nullable<bool> IsAcknowledged { get; set; }

        public Nullable<DateTime> AcknowledgedOn { get; set; }

        public bool IsRequestedByGroup { get; set; }

        public bool IsRequestedByTeam { get; set; }

        public bool IsRequestedByUser { get; set; }

        public bool IsRequestedByPage { get; set; }

        public bool IsGroupLink { get; set; }

        public bool IsTeamLink { get; set; }

        public bool IsLicenseLink { get; set; }

        public bool IsPageLink { get; set; }

        public bool IsMemberLink { get; set; }

        public bool AckStatus { get; set; }

        public bool IsActivity { get; set; }

        public bool IsOverdueActivity { get; set; }

        public bool IsTodayActivity { get; set; }

        public DateTime FromDateTime { get; set; }

        public DateTime ToDatTime { get; set; }

        public NotificationVM NotificationVM { get; set; }
    }
}

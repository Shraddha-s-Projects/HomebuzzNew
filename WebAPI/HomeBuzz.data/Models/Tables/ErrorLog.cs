using System;

namespace HomeBuzz.data.Models
{
    public class ErrorLog
    {
        public int ID { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public string TargetSite { get; set; }
        public string InnerException { get; set; }
        public Nullable<int> UserID { get; set; }
    }
}
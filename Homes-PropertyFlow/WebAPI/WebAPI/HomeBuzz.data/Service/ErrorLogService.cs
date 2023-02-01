namespace HomeBuzz.data {
    using System;
    using HomeBuzz.data.Models;

    public class ErrorLogService {
        private HomeBuzzContext _context;

        public ErrorLogService (HomeBuzzContext context) {
            _context = context;
        }
        public void LogException (Exception ex) {
            ErrorLog errorLog = new ErrorLog ();
            errorLog.CreatedTime = DateTime.Now;
            if (ex.InnerException != null)
                errorLog.InnerException = ex.InnerException.Message;
            errorLog.Message = ex.Message;
            errorLog.Source = ex.Source;
            errorLog.StackTrace = ex.StackTrace;
            //errorLog.UserID =Convert.ToInt16(UserId);
            _context.ErrorLog.Add (errorLog);
            _context.SaveChanges ();
        }

        public void LogMessage (string Message) {
            ErrorLog errorLog = new ErrorLog ();
            errorLog.CreatedTime = DateTime.Now;
            errorLog.Message = Message;
            _context.ErrorLog.Add (errorLog);
            _context.SaveChanges ();
        }
    }
}
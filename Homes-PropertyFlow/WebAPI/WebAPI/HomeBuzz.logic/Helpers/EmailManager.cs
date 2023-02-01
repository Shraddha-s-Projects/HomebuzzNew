using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web;
using HomeBuzz.data;
using HomeBuzz.data.Models;

namespace HomeBuzz.helper {
    public class EmailManager {

        public static void SendMail (string mTo, string mSubject, string mBody) {
            SendMail (mTo, mSubject, mBody, null);
        }

        public static void SendMail (string mTo, string mSubject, string mBody, Attachment Attachments) //AttachmentCollection
        {
            string mailBody = mBody;

            string mailServer = "smtp.gmail.com";
            string mailUser = "example@gmail.com";
            string mailPassword = "admin@123";
            string mailTo = mTo;
            string mailFrom = "do_not_reply@mailinaotor.com";
            int port = 587;

            if (string.IsNullOrEmpty (mTo))
                mTo = mailTo;

            MailMessage mailObject = new MailMessage ();
            mailObject.To.Add (mTo);
            mailObject.From = new MailAddress (mailFrom, mailFrom);

            mailObject.Subject = mSubject;
            mailObject.IsBodyHtml = true;
            mailObject.Body = mailBody;
            mailObject.BodyEncoding = System.Text.Encoding.UTF8;
            mailObject.SubjectEncoding = System.Text.Encoding.UTF8;
            //rvb 27/11/2016 Comment out for moment, but we may re-instate later if Origin want this feature
            if (Attachments != null) {
                //foreach (var attachment in Attachments)
                //{
                mailObject.Attachments.Add (Attachments);
                //}
            }

            SmtpClient smtp = new SmtpClient ();

            smtp.Host = mailServer;
            smtp.Port = port;
            // smtp.EnableSsl = true;
            System.Net.NetworkCredential basicAuthenticationInfo = new System.Net.NetworkCredential (mailUser, mailPassword);
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = basicAuthenticationInfo;

            smtp.Send (mailObject);
        }

        #region Send Email Async
        public static async Task SendMailAsync (string mTo, string mSubject, string mBody) {
            try
            {
              await Task.Run (() => SendMailSendGridAsync(mTo, mSubject, mBody, null));
            }
            catch (Exception ex)
            {   
                throw ex;
            }
        }

        public static async Task SendMailSendGridAsync(string mTo, string mSubject, string mBody, Attachment Attachments) //AttachmentCollection
        {
            MailMessage mailMsg = new MailMessage();

            // To
            mailMsg.To.Add(new MailAddress(mTo, "To Name"));

            // From
            mailMsg.From = new MailAddress("no-reply@propertyflow.co.nz", "PropertyFlow");

            // Subject and multipart/alternative Body
            mailMsg.Subject = mSubject;
            //string text = "text body";
            string html = mBody;
            //mailMsg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            mailMsg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));

            // Init SmtpClient and send
            SmtpClient smtpClient = new SmtpClient("smtp.sendgrid.net", Convert.ToInt32(587));
            // System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("azure_05d15ceb8d2a3d1d844b4cf64871f933@azure.com", "homebuzz_email_123");
            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("azure_d15681e31e77cde6dba08a5fffd3ac92@azure.com", "propertylight_123");
            smtpClient.Credentials = credentials;

            smtpClient.Send(mailMsg);
        }

        public static async Task SendMailAsync (string mTo, string mSubject, string mBody, Attachment Attachments) //AttachmentCollection
        {
            string mailBody = mBody;
            string mailServer = "smtp.gmail.com";
            //  string mailUser = "example@gmail.com";
            string mailUser = "shraddha.prajapati@techavidus.com";
            //  string mailPassword = "admin@123";
            string mailPassword = "abel@123";
            string mailTo = mTo;
            // string mailFrom = "do_not_reply@mailinaotor.com";
            string mailFrom = "teamabel703@gmail.com";
            int port = 587;

            if (string.IsNullOrEmpty (mTo))
                mTo = mailTo;

            MailMessage mailObject = new MailMessage ();
            mailObject.To.Add (mTo);
            mailObject.From = new MailAddress (mailFrom, mailFrom);

            mailObject.Subject = mSubject;
            mailObject.IsBodyHtml = true;
            mailObject.Body = mailBody;
            mailObject.BodyEncoding = System.Text.Encoding.UTF8;
            mailObject.SubjectEncoding = System.Text.Encoding.UTF8;

            //rvb 27/11/2016 Comment out for moment, but we may re-instate later if Origin want this feature
            if (Attachments != null) {
                //foreach (var attachment in Attachments)
                //{
                mailObject.Attachments.Add (Attachments);
                //}
            }

            SmtpClient smtp = new SmtpClient ();

            smtp.Host = mailServer;
            smtp.Port = port;
            smtp.EnableSsl = true;
            System.Net.NetworkCredential basicAuthenticationInfo = new System.Net.NetworkCredential (mailFrom, mailPassword);
            //  System.Net.NetworkCredential basicAuthenticationInfo = new System.Net.NetworkCredential (mailUser, mailPassword);
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = basicAuthenticationInfo;
            try {
                smtp.Send (mailObject);
            } catch (Exception ex) {
                 throw ex;
            }

            Console.WriteLine ("after mail sent");
        }
        #endregion
    }
}
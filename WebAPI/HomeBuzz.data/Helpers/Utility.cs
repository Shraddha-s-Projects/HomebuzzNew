namespace HomeBuzz.data
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Security.Cryptography;
    using System.Text;

    public static class DataUtility
    {
        #region Helper Methods

        /// <summary>
        /// Function that creates an object from the given data row
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="row"></param>
        /// <returns></returns>
        public static T CreateItemFromRow<T>(DataRow row) where T : new()
        {
            // create a new object
            T item = new T();

            // set the item
            SetItemFromRow(item, row);

            // return 
            return item;
        }

        /// <summary>
        /// Function that set item from the given row
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="item"></param>
        /// <param name="row"></param>
        public static void SetItemFromRow<T>(T item, DataRow row) where T : new()
        {
            // go through each column
            foreach (DataColumn c in row.Table.Columns)
            {
                // find the property for the column
                PropertyInfo p = item.GetType().GetProperty(c.ColumnName);

                // if exists, set the value
                if (p != null && row[c] != DBNull.Value)
                {
                    p.SetValue(item, row[c], null);
                }
            }
        }

        /// <summary>
        /// function that creates a list of an object from the given data table
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tbl"></param>
        /// <returns></returns>
        public static List<T> CreateListFromTable<T>(DataTable tbl) where T : new()
        {
            // define return list
            List<T> lst = new List<T>();

            // go through each row
            foreach (DataRow r in tbl.Rows)
            {
                // add to the list
                lst.Add(CreateItemFromRow<T>(r));
            }

            // return the list
            return lst;
        }

        /// <summary>
        /// Check if table is exist in application
        /// </summary>
        /// <typeparam name="T">Class of data table to check</typeparam>
        /// <param name="db">DB Object</param>
        public static bool CheckTableExistsInApplication<T>(this HomeBuzzContext db) where T : class
        {
            try
            {
                db.Set<T>().Count();
                return true;

            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Get SHA1 hash of given text
        /// </summary>
        public class ShaHash
        {
            public static String GetHash(string text)
            {
                // SHA512 is disposable by inheritance.  
                using (var sha256 = SHA256.Create())
                {
                    // Send a sample text to hash.  
                    var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(text));
                    // Get the hashed string.  
                    return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                }
            }
        }

        /// <summary>
        /// This function copy source object property value to destination object property value
        /// This function copy value for only properties having same name
        /// </summary>
        /// <param name="sourceClassObject">Object of source class</param>
        /// <param name="destinationClassObject">Object of destination class</param>
        public static void CopyObject(object sourceClassObject, object destinationClassObject)
        {
            foreach (PropertyInfo property in sourceClassObject.GetType().GetProperties())
            {
                if (!property.CanRead || (property.GetIndexParameters().Length > 0))
                    continue;

                PropertyInfo other = destinationClassObject.GetType().GetProperty(property.Name);
                if ((other != null) && (other.CanWrite))
                    other.SetValue(destinationClassObject, property.GetValue(sourceClassObject, null), null);
            }
        }
        #endregion

        #region Constant
        // Company
        public const string CompanyName = "PropertyFlow";

        //Google Recapcha 
        public const string GoogleRecapchaVerifyUrl = "https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}";
        public const string GoogleRecapchaSiteKey = "6LempkcUAAAAAKEyaNeC1Yh4vIWhFGPLPolKQp8i";
        public const string GoogleRecapchaSiteSecret = "6LempkcUAAAAALQJHld2BhgiFLi1Ng0Ju4ce8R17";

        //Notification
        public const string NotificationWelcome = "Thanks for signing up with us. Welcome to {0}!";
        #endregion

        #region Enum
        public enum VerificationCodeType
        {
            EmailChange = 1,
            SignupEmail = 2,
            PasswordReset = 3
        }

        public enum NotificationType
        {
            Notification = 1
        }

        public enum CreditAmount
        {
            InviteUserSuccess = 10
        }

        public enum CreditableInvites
        {
            Value = 10
        }
        #endregion

        #region Format Methods
        /// <summary>
        /// This function convert name into Title case letter
        /// </summary>
        /// <param name="str">Name</param>
        /// <returns></returns>
        public static string ToTitleCase(string str)
        {
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
            return textInfo.ToTitleCase(str.ToLower().Trim());
        }

        /// <summary>
        /// This function used to provide current date for the system.
        /// This is mostly used for CreatedOn field.
        /// </summary>
        /// <returns></returns>
        public static DateTime GetCurrentDateTime()
        {
            return System.DateTime.UtcNow;
        }
        #endregion

    }
}
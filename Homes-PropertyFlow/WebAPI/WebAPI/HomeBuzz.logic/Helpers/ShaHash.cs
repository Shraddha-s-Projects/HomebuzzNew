using System;
using System.Security.Cryptography;
using System.Text;

namespace HomeBuzz.helper {
    public class ShaHash {
        public static String GetHash (string text) {
            using (var sha256 = SHA256.Create ()) {
                // Send a sample text to hash.  
                var hashedBytes = sha256.ComputeHash (Encoding.UTF8.GetBytes (text));
                // Get the hashed string.  
                return BitConverter.ToString (hashedBytes).Replace ("-", "").ToLower ();
            }
        }

          public static String GetStringHash (string text) {
            // SHA512 is disposable by inheritance. 
            string base64Decoded;
            byte[] data = System.Convert.FromBase64String (text);
            base64Decoded = System.Text.ASCIIEncoding.ASCII.GetString (data);
            
            using (var sha256 = SHA256.Create ()) {
                // Send a sample text to hash.  
                var hashedBytes = sha256.ComputeHash (Encoding.UTF8.GetBytes (base64Decoded));
                // Get the hashed string.  
                return BitConverter.ToString (hashedBytes).Replace ("-", "").ToLower ();
            }
        }
    }
}
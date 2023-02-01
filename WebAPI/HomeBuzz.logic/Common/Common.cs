using HomeBuzz.data;
using HomeBuzz.helper;
using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net;
using Newtonsoft.Json.Linq;

namespace HomeBuzz.logic
{
    public class CommonFunction
    {
        #region Property Initialization
       
        #endregion

        #region Constructor
        public CommonFunction()
        {
          
        }
        #endregion

        #region Get Function
        public async Task<Recapcha> ValidateCapchaResponse(Recapcha model)
        {
            model.secret = DataUtility.GoogleRecapchaSiteSecret;
            var client = new WebClient();
            var result = client.DownloadString(string.Format(DataUtility.GoogleRecapchaVerifyUrl, model.secret, model.response));
            model = JObject.Parse(result).ToObject<Recapcha>();
            return model;
        }
        #endregion

        #region Set Functions
      
        #endregion

        #region Private Functions
       
        #endregion
    }
}

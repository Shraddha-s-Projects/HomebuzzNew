using HomeBuzz.data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace HomeBuzz.Helpers
{
    public static class SystemSettings
    {
        public static Dictionary<String, String> Dictionary { get; set; }

        public static Dictionary<string, string> GetSystemSettingByCodes(string code, ISystemSettingService _systemSettingService)
        {
            Dictionary<String, String> systemsSettings = new Dictionary<String, String>();
            var systemSetting = _systemSettingService.GetSystemSettingByCodes(code.Split(','));
            if (systemSetting != null)
            {
                foreach (var item in systemSetting)
                {
                    if(!systemsSettings.ContainsKey(item.Code))
                        systemsSettings.Add(item.Code, HttpUtility.HtmlDecode(item.Value));
                }
            }
            Dictionary = systemsSettings;
            return systemsSettings;
        }
    }
}

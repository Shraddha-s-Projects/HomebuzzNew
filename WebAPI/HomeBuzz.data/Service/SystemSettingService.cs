using System.Collections.Generic;
using System.Data.SqlClient;
using HomeBuzz.data.Models;
using System.Linq;
using System;
using System.Web;

namespace HomeBuzz.data
{
    public partial class SystemSettingService : ServiceBase<SystemSetting>, ISystemSettingService
    {
        private readonly IGetAllSystemSettingRepository _getAllSystemSettingRepository;

        public static Dictionary<String, String> Dictionary { get; set; }

        public SystemSettingService(IDbFactory dbFactory, IUnitOfWork unitOfWork, IGetAllSystemSettingRepository getAllSystemSettingRepository) : base(dbFactory, unitOfWork)
        {
            _getAllSystemSettingRepository = getAllSystemSettingRepository;
        }

        public SystemSetting CheckInsertOrUpdate(SystemSetting systemSetting)
        {
            var existingItem = GetMany(t => t.SystemSettingId == systemSetting.SystemSettingId && t.IsDeleted == false).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateSystemSetting(existingItem, systemSetting);
            }
            else
            {
                return InsertSystemSetting(systemSetting);
            }
        }

        public SystemSetting InsertSystemSetting(SystemSetting systemSetting)
        {
            var newItem = Add(systemSetting);
            SaveAsync();

            return newItem;
        }

        public SystemSetting UpdateSystemSetting(SystemSetting existingItem, SystemSetting systemSetting)
        {
            existingItem.Code = systemSetting.Code;
            existingItem.Name = systemSetting.Name;
            existingItem.Description = systemSetting.Description;
            existingItem.ValueTypeId = systemSetting.ValueTypeId;
            existingItem.Value = systemSetting.Value;
            existingItem.LastModifiedOn = systemSetting.LastModifiedOn;

            UpdateAsync(existingItem, existingItem.SystemSettingId);
            SaveAsync();

            return existingItem;
        }

        public List<SystemSettingResult> GetAllSystemSettings(long userId, SystemSettingFilter model)
        {
            SqlParameter[] parameters = new SqlParameter[] {
                new SqlParameter{ParameterName="@FilterInfoCode", Value= model.FilterInfoCode},
                new SqlParameter{ParameterName="@Query", Value= model.Query},
                new SqlParameter{ParameterName="@PageNum", Value= model.PageNum},
                new SqlParameter{ParameterName="@PageSize", Value= model.PageSize},
                new SqlParameter{ParameterName="@CategoryId", Value= model.CategoryId},

            };
            return _getAllSystemSettingRepository.ExecuteSP<SystemSettingResult>("GetAllSystemSetting", parameters).ToList();
        }

        public List<SystemSetting> GetSystemSettingByCategory(long systemSettingCategoryId)
        {
            return GetMany(x => x.SystemSettingCategoryId == (systemSettingCategoryId > 0 ? systemSettingCategoryId : x.SystemSettingCategoryId) && x.IsDeleted == false).Result.ToList();
        }

        public SystemSetting GetSettingById(long systemSettingId)
        {
            return GetMany(x => x.SystemSettingId == systemSettingId && x.IsDeleted == false).Result.FirstOrDefault();
        }

        public SystemSetting GetSystemSettingByCode(string code)
        {
            return GetMany(x => x.Code.ToLower().Trim().Equals(code.ToLower().Trim()) && x.IsDeleted == false).Result.FirstOrDefault();
        }

        public List<SystemSetting> GetSystemSettingByCodes(string[] codes)
        {
            return GetMany(x => codes.Contains(x.Code)).Result.ToList();
        }

        public string GetSystemSettingValueByCode(string code)
        {
            return GetMany(x => x.Code.ToLower().Trim().Equals(code.ToLower().Trim()) && x.IsDeleted == false).Result.FirstOrDefault().Value;
        }

        public Dictionary<string, string> GetSystemSettingListByCodes(string[] codes)
        {
            var settingList = GetMany(x => codes.Contains(x.Code)).Result.ToList();
            Dictionary<String, String> systemsSettings = new Dictionary<String, String>();
            if (settingList != null)
            {
                if (settingList != null)
                {
                    foreach (var item in settingList)
                    {
                        systemsSettings.Add(item.Code, HttpUtility.HtmlDecode(item.Value));
                    }
                }
            }
            Dictionary = systemsSettings;
            return systemsSettings;
        }
    }

    public partial interface ISystemSettingService : IService<SystemSetting>
    {
        SystemSetting CheckInsertOrUpdate(SystemSetting systemSetting);

        List<SystemSettingResult> GetAllSystemSettings(long userId, SystemSettingFilter model);

        List<SystemSetting> GetSystemSettingByCategory(long systemSettingCategoryId);

        SystemSetting GetSettingById(long systemSettingId);

        SystemSetting GetSystemSettingByCode(string code);

        List<SystemSetting> GetSystemSettingByCodes(string[] codes);

        string GetSystemSettingValueByCode(string code);

        Dictionary<string, string> GetSystemSettingListByCodes(string[] code);

    }
}

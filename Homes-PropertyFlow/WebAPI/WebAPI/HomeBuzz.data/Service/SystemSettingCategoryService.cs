using System.Collections.Generic;
using System.Data.SqlClient;
using HomeBuzz.data.Models;
using HomeBuzz.data;
using System.Threading.Tasks;
using System.Linq;

namespace HomeBuzz.data
{
    public partial class SystemSettingCategoryService : ServiceBase<SystemSettingCategory>, ISystemSettingCategoryService
    {
        public SystemSettingCategoryService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public SystemSettingCategory CheckInsertOrUpdate(SystemSettingCategory systemSettingCategory)
        {
            var existingItem = GetMany(t => t.SystemSettingCateogoryId == systemSettingCategory.SystemSettingCateogoryId && t.IsDeleted == false).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateSystemSettingCategory(existingItem, systemSettingCategory);
            }
            else
            {
                return InsertSystemSettingCategory(systemSettingCategory);
            }
        }

        public SystemSettingCategory InsertSystemSettingCategory(SystemSettingCategory systemSettingCategory)
        {
            var newItem = Add(systemSettingCategory);
            SaveAsync();

            return newItem;
        }

        public SystemSettingCategory UpdateSystemSettingCategory(SystemSettingCategory existingItem, SystemSettingCategory systemSettingCategory)
        {
            existingItem.SystemSettingCatName = systemSettingCategory.SystemSettingCatName;
            existingItem.Code = systemSettingCategory.Code.ToUpper();
            existingItem.LastModifiedOn = systemSettingCategory.LastModifiedOn;
            UpdateAsync(existingItem, existingItem.SystemSettingCateogoryId);
            SaveAsync();

            return existingItem;
        }

        public List<SystemSettingCategory> GetAllSystemCategories(long userId)
        {
            return GetMany(x => x.IsDeleted == false).Result.ToList();
        }

        public SystemSettingCategory GetCategoryById(long systemSettingCategoryId)
        {
            return GetMany(x => x.SystemSettingCateogoryId == systemSettingCategoryId && x.IsDeleted == false).Result.FirstOrDefault();
        }

        public SystemSettingCategory GetSystemSettingCategoryByCode(string code)
        {
            return GetMany(x => x.Code.ToLower().Trim().Equals(code.ToLower().Trim()) && x.IsDeleted == false).Result.FirstOrDefault();
        }

        public List<SystemSettingCategory> GetSystemSettingCategoryByCodes(string[] codes)
        {
            return GetMany(x => codes.Contains(x.Code)).Result.ToList();
        }
    }

    public partial interface ISystemSettingCategoryService : IService<SystemSettingCategory>
    {
        SystemSettingCategory CheckInsertOrUpdate(SystemSettingCategory systemSettingCategory);

        List<SystemSettingCategory> GetAllSystemCategories(long userId);

        SystemSettingCategory GetCategoryById(long systemSettingCategoryId);

        SystemSettingCategory GetSystemSettingCategoryByCode(string code);

        List<SystemSettingCategory> GetSystemSettingCategoryByCodes(string[] codes);
    }
}

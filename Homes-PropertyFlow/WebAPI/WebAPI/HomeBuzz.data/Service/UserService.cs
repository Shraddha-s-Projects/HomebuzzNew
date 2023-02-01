namespace HomeBuzz.data {
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using HomeBuzz.data.Models;
    using HomeBuzz.data.ViewModels;

    public partial class UserService : ServiceBase<User>, IUserService {
        private readonly IPropertyRepository _propertyRepository;
        public UserService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public User CheckAndUpdate (User user) {
            var existingItem = GetMany (t => (t.UserId == user.UserId || t.Email.ToLower () == user.Email.ToLower ()) && t.IsDeleted == false).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdateUser (existingItem, user);
            }

            return null;
        }

        public User UpdateUser (User existingItem, User user) {
            existingItem.UserName = user.UserName;
            existingItem.FirstName = user.FirstName;
            existingItem.LastName = user.LastName;
            existingItem.Email = user.Email;
            existingItem.PhoneNo = user.PhoneNo;
            // existingItem.Password = user.Password;
            existingItem.LastUpdatedOn = DataUtility.GetCurrentDateTime ();

            UpdateAsync (existingItem, existingItem.UserId);
            SaveAsync ();

            return existingItem;
        }

        public User CheckAndUpdateUserForAdmin (User user) {
            var existingItem = GetMany (t => (t.UserId == user.UserId || t.Email.ToLower () == user.Email.ToLower ()) && t.IsDeleted == false).Result.FirstOrDefault ();

            if (existingItem != null) {
                return UpdateUserForAdmin (existingItem, user);
            }
            return null;
        }

        public User UpdateUserForAdmin (User existingItem, User user) {
            existingItem.UserName = user.UserName;
            existingItem.FirstName = user.FirstName;
            existingItem.LastName = user.LastName;
            existingItem.Email = user.Email;
            existingItem.PhoneNo = user.PhoneNo;
            existingItem.IsActive = user.IsActive;
            existingItem.LastUpdatedOn = DataUtility.GetCurrentDateTime ();

            UpdateAsync (existingItem, existingItem.UserId);
            SaveAsync ();

            return existingItem;
        }

        public List<User> RemoveUser (long UserId) {
            // var existingItem = GetMany (t => t.UserId == UserId && t.IsDeleted == false).Result.FirstOrDefault ();
            // existingItem.IsDeleted = true;
            // UpdateAsync (existingItem, existingItem.UserId);
            // SaveAsync ();

            // return existingItem;

             SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@userId", Value = UserId }
            };

            var data = _propertyRepository.ExecuteSP<User> ("ADMIN_REMOVEUSER", parameters).ToList ();
            return data;
        }

        public User GetUserByEmailHash (string email) {
            return GetMany (t => DataUtility.ShaHash.GetHash (t.Email).ToLower () == email.ToLower () && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public User GetUserByPasswordHash (string passHash) {
            return GetMany (t => t.Password.Equals (passHash) && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public User GetUserByEmail (string email) {
            var user = GetMany (t => t.Email.ToLower () == email.ToLower () && t.IsDeleted == false).Result;
            return user != null ? user.FirstOrDefault () : null;
        }

        public User GetUserByUserId (long userId) {
            return GetMany (t => t.UserId == userId && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public User IsEmailAlreadyRegistered (string email) {
            return GetMany (t => t.Email.ToLower () == email.ToLower () && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public List<User> GetUsersByRoleId (int roleId) {
            return GetMany (t => t.RoleId == roleId && t.IsDeleted == false).Result.ToList ();
        }

        public List<User> GetAgentsByCompany (int companyId) {
            return GetMany (t => t.Company == companyId && t.IsDeleted == false).Result.ToList ();
        }

        public User IsEmailCheckWithOtherUsers (string email, long userId) {
            return GetMany (t => t.Email.ToLower () == email.ToLower () && t.UserId != userId && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public User IsPhoneNoCheckWithOtherUsers (string PhoneNo, long userId) {
            return GetMany (t => t.PhoneNo.ToLower () == PhoneNo.ToLower () && t.UserId != userId && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public User GetUserByUserName (string userName) {
            return GetMany (t => t.UserName.ToLower () == userName.ToLower () && t.IsDeleted == false).Result.FirstOrDefault ();
        }

        public List<User> SearchUser (string query) {
            return GetMany (t => (t.FirstName.ToLower ().Contains (query) || t.LastName.ToLower ().Contains (query)) && t.IsDeleted == false).Result.ToList ();
        }

        public string GetFullNameByUserId (long userId) {
            var user = GetMany (t => t.UserId == userId && t.IsDeleted == false).Result.FirstOrDefault ();
            return user != null ? user.FirstName + " " + user.LastName : "";
        }

        public List<AdminUserVM> GetUsersForAdmin (AdminUserVM Model) {
            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@PageNum", Value = Model.PageNum },
                new SqlParameter { ParameterName = "@PageSize", Value = Model.PageSize },
                new SqlParameter { ParameterName = "@OrderColumnName", Value = Model.OrderColumnName },
                new SqlParameter { ParameterName = "@OrderColumnDir", Value = Model.OrderColumnDir },
                new SqlParameter { ParameterName = "@FirstName", Value = Model.FirstName },
                new SqlParameter { ParameterName = "@LastName", Value = Model.LastName },
                new SqlParameter { ParameterName = "@UserName", Value = Model.UserName },
                new SqlParameter { ParameterName = "@Email", Value = Model.Email },
                // new SqlParameter { ParameterName = "@PhoneNo", Value = Model.PhoneNo },
                new SqlParameter { ParameterName = "@IsActive", Value = Model.IsActive },
                new SqlParameter { ParameterName = "@RoleId", Value = Model.RoleId },
                new SqlParameter { ParameterName = "@AgentAdminId", Value = Model.AgentAdminId }
            };

            var data = _propertyRepository.ExecuteSP<AdminUserVM> ("GETUSERSFORADMIN", parameters).ToList ();
            return data;
        }
    }

    public partial interface IUserService : IService<User> {
        User CheckAndUpdate (User user);
        User CheckAndUpdateUserForAdmin (User user);
        User GetUserByEmailHash (string email);
        User GetUserByPasswordHash (string email);
        User GetUserByEmail (string email);
        User GetUserByUserId (long userId);
        string GetFullNameByUserId (long userId);
        User IsEmailCheckWithOtherUsers (string email, long userId);
        User IsPhoneNoCheckWithOtherUsers (string PhoneNo, long userId);
        List<User> GetUsersByRoleId (int roleId);
        List<User> GetAgentsByCompany (int companyId);
        List<AdminUserVM> GetUsersForAdmin (AdminUserVM Model);
        List<User> RemoveUser (long UserId);
    }
}
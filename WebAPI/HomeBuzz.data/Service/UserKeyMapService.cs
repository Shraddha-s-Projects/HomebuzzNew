using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {

    public partial class UserKeyMapService : ServiceBase<UserKeyMap>, IUserKeyMapService {
        public UserKeyMapService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<UserKeyMap> GetAllUserKey () {
            return GetAllAsync().Result.ToList();
        }

        public List<UserKeyMap> GetAllUserKeyByUserId(long UserId){
            return GetMany(t => t.UserId == UserId).Result.ToList();
        }

        public UserKeyMap CheckInsertOrUpdate(UserKeyMap Model){
            var existingItem = GetMany(t => t.UserKey == Model.UserKey).Result.FirstOrDefault();
             if (existingItem != null) {
                 existingItem.UserId = Model.UserId;
                return UpdateUserKey (existingItem, Model);
            } else {
                Model.CreatedOn = DateTime.Now;
                return InsertUserKey (Model);
            }
        }
        public UserKeyMap InsertUserKey (UserKeyMap Model) {
			var newItem = Add (Model);
			SaveAsync ();

			return newItem;
		}
		public UserKeyMap UpdateUserKey (UserKeyMap existingItem, UserKeyMap Model) {
			UpdateAsync (existingItem, existingItem.Id);
			SaveAsync ();

			return existingItem;
		}
    }

    public partial interface IUserKeyMapService : IService<UserKeyMap> {
        List<UserKeyMap> GetAllUserKey ();
        List<UserKeyMap> GetAllUserKeyByUserId(long UserId);
        UserKeyMap CheckInsertOrUpdate(UserKeyMap Model);
    }
}
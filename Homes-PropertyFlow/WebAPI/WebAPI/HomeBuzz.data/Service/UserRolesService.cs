// using System.Collections.Generic;
// using System.Linq;
// using HomeBuzz.data.Models.Tables;

// namespace HomeBuzz.data.Service {
//     public partial class UserRolesService : ServiceBase<UserRoles>, IUserRolesService {
//         public UserRolesService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

//         }

//         public List<UserRoles> GetAllUserRoles () {
//             return GetAllAsync ().Result.ToList ();
//         }

//         public UserRoles GetUserRoleById (int RoleId) {
//             return GetMany (t => t.Id == RoleId).Result.FirstOrDefault ();
//         }
//     }

//     public partial interface IUserRolesService : IService<UserRoles> {

//         List<UserRoles> GetAllUserRoles ();

//         UserRoles GetUserRoleById (int RoleId);
//     }
// }

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {

    public partial class UserRolesService : ServiceBase<UserRoles>, IUserRolesService {
        public UserRolesService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<UserRoles> GetAllUserRoles () {
            return GetAllAsync ().Result.ToList ();
        }

        public UserRoles GetUserRoleById (int RoleId) {
            return GetMany (t => t.Id == RoleId).Result.FirstOrDefault ();
        }

        public UserRoles GetUserRoleByName (string Role) {
            return GetMany (t => t.Role == Role).Result.FirstOrDefault ();
        }
    }

    public partial interface IUserRolesService : IService<UserRoles> {

        List<UserRoles> GetAllUserRoles ();

        UserRoles GetUserRoleById (int RoleId);

        UserRoles GetUserRoleByName (string Role);

    }
}
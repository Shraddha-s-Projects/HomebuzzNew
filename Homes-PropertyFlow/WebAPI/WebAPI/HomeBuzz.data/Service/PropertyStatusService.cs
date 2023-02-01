using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {

    public partial class PropertyStatusService : ServiceBase<PropertyStatus>, IPropertyStatusService {
        public PropertyStatusService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<PropertyStatus> GetAllPropertyStatus () {
            return GetMany (x => x.IsDeleted == false).Result.ToList ();
        }
    }

    public partial interface IPropertyStatusService : IService<PropertyStatus> {

        List<PropertyStatus> GetAllPropertyStatus ();

    }
}
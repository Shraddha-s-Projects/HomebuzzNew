using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service
{
    public class PropertyActionService: ServiceBase<PropertyAction>, IPropertyActionService {
        public PropertyActionService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<PropertyAction> GetAllPropertyAction () {
            return GetMany (x => x.IsDeleted == false).Result.ToList ();
        }
    }

     public partial interface IPropertyActionService : IService<PropertyAction> {

        List<PropertyAction> GetAllPropertyAction ();

    }
}
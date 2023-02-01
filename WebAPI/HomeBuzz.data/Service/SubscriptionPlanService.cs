using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {
        public partial class SubscriptionPlanService : ServiceBase<SubscriptionPlan>, ISubscriptionPlanService {
                public SubscriptionPlanService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

                }

                public List<SubscriptionPlan> GetAllSubscriptionPlan () {
                    return GetMany (x => x.IsDeleted == false).Result.ToList ();
                }
            }
            public partial interface ISubscriptionPlanService : IService<SubscriptionPlan> {

                List<SubscriptionPlan> GetAllSubscriptionPlan ();

            }
        }
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class SubscriptionPlanDetailService : ServiceBase<SubscriptionPlanDetail>, ISubscriptionPlanDetailService {
        public SubscriptionPlanDetailService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<SubscriptionPlanDetail> GetAllSubscriptionPlanDetail () {
            return GetMany (x => x.IsDeleted == false).Result.ToList ();
        }

        public SubscriptionPlanDetail GetlSubscriptionPlanDetailByPlanId (int PlanId) {
            return GetMany (x => x.IsDeleted == false && x.SubscriptionPlan == PlanId).Result.FirstOrDefault ();
        }
        public SubscriptionPlanDetail GetlSubscriptionPlanDetailById (int Id) {
            return GetMany (x => x.IsDeleted == false && x.Id == Id).Result.FirstOrDefault ();
        }
    }
    public partial interface ISubscriptionPlanDetailService : IService<SubscriptionPlanDetail> {

        List<SubscriptionPlanDetail> GetAllSubscriptionPlanDetail ();
        SubscriptionPlanDetail GetlSubscriptionPlanDetailByPlanId (int PlanId);
        SubscriptionPlanDetail GetlSubscriptionPlanDetailById (int Id);

    }
}
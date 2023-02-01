using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service {
    public partial class AgentPaymentService : ServiceBase<AgentPayment>, IAgentPaymentService {
        public AgentPaymentService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<AgentPayment> GetAllAgentPayments () {
            return GetMany (x => x.IsDeleted == false).Result.ToList ();
        }

        public AgentPayment CheckInsertOrUpdate (AgentPayment payment) {
            AgentPayment existingItem;
            if (payment.Company != null) {
                existingItem = GetMany (t => t.Company == payment.Company && t.IsDeleted == false).Result.FirstOrDefault ();
            } else {
                existingItem = GetMany (t => t.User == payment.User && t.IsDeleted == false).Result.FirstOrDefault ();
            }

            if (existingItem != null) {
                return UpdateAgentPayment (existingItem, payment);
            }
            //Add new
            else {
                return InsertAgentPayment (payment);
            }
        }

        public AgentPayment UpdateAgentPayment (AgentPayment existingItem, AgentPayment payment) {
            existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, payment.Id);
            SaveAsync ();

            return existingItem;
        }

        public AgentPayment InsertAgentPayment (AgentPayment payment) {
            payment.CreatedOn = DateTime.Now;
            var newItem = Add (payment);
            SaveAsync ();

            return newItem;
        }
    }

    public partial interface IAgentPaymentService : IService<AgentPayment> {
        List<AgentPayment> GetAllAgentPayments ();
        AgentPayment CheckInsertOrUpdate (AgentPayment payment);
    }
}
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;

namespace HomeBuzz.data.Service {
    public partial class PropertyAgentService : ServiceBase<PropertyAgent>, IPropertyAgentService {
        private readonly IPropertyRepository _propertyRepository;
        public PropertyAgentService (IDbFactory dbFactory, IUnitOfWork unitOfWork, IPropertyRepository propertyRepository) : base (dbFactory, unitOfWork) {
            _propertyRepository = propertyRepository;
        }

        public List<PropertyAgent> GetAllPropertyAgent () {
            return GetAllAsync ().Result.ToList ();
        }

        public PropertyAgent CheckInsertOrUpdate (PropertyAgent propertyAgent) {
            var existingItem = GetMany (t => t.PropertyDetailId == propertyAgent.PropertyDetailId && t.OwnerId == propertyAgent.OwnerId).Result.FirstOrDefault ();
            if (existingItem != null) {
                existingItem.AgentOptionId = propertyAgent.AgentOptionId;
                return UpdatePropertyAgent (existingItem, propertyAgent);
            } else {
                return InsertPropertyAgent (propertyAgent);
            }
        }

        public List<Property> GetAllAgentProperties (PropertyAgentVM propertyAgentVM) {
            SqlParameter[] parameters = {
                new SqlParameter { ParameterName = "@userId", Value = propertyAgentVM.OwnerId },
                new SqlParameter { ParameterName = "@AgentOptionId", Value = propertyAgentVM.AgentOptionId },
                new SqlParameter { ParameterName = "@StartDate", Value = propertyAgentVM.StartDate },
                new SqlParameter { ParameterName = "@EndDate", Value = propertyAgentVM.EndDate },
                new SqlParameter { ParameterName = "@PageNum", Value = propertyAgentVM.PageNum }
            };

            return _propertyRepository.ExecuteSP<Property> ("GET_AGENT_PROPERTIES", parameters).ToList ();
        }

        public PropertyAgent GetPropertyAgentByDetailId (PropertyAgentVM propertyAgent) {
            return GetMany (t => t.PropertyDetailId == propertyAgent.PropertyDetailId.Value && t.OwnerId == propertyAgent.OwnerId.Value).Result.FirstOrDefault ();
        }

        public PropertyAgent InsertPropertyAgent (PropertyAgent propertyAgent) {
            propertyAgent.CreatedOn = DataUtility.GetCurrentDateTime ();
            var newItem = Add (propertyAgent);
            SaveAsync ();

            return newItem;
        }
        public PropertyAgent UpdatePropertyAgent (PropertyAgent existingItem, PropertyAgent propertyAgent) {
            existingItem.UpdatedOn = DataUtility.GetCurrentDateTime ();
            UpdateAsync (existingItem, existingItem.Id);
            SaveAsync ();

            return existingItem;
        }

        public bool IsListProerty (int PropertyDetailId) {
            var count = GetMany (t => t.PropertyDetailId == PropertyDetailId && t.AgentOptionId == 1).Result.Count ();
            if (count > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    public partial interface IPropertyAgentService : IService<PropertyAgent> {
        List<PropertyAgent> GetAllPropertyAgent ();
        PropertyAgent CheckInsertOrUpdate (PropertyAgent propertyAgent);
        List<Property> GetAllAgentProperties (PropertyAgentVM propertyAgentVM);
        PropertyAgent GetPropertyAgentByDetailId (PropertyAgentVM propertyAgent);
        bool IsListProerty (int PropertyDetailId);
    }
}
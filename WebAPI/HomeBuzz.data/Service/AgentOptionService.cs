using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models.Tables;

namespace HomeBuzz.data.Service
{
    public partial class AgentOptionService  : ServiceBase<AgentOption>, IAgentOptionService
    {
          public AgentOptionService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<AgentOption> GetAllAgentOptions () {
            return GetAllAsync().Result.ToList();
        }
    }

    public partial interface IAgentOptionService : IService<AgentOption> {
        List<AgentOption> GetAllAgentOptions ();
    }
}
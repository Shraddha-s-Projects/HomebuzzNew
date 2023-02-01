using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HomeBuzz.data
{
    public partial class StateService : ServiceBase<State>, IStateService
    {
        public StateService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public State CheckInsertOrUpdate(State state)
        {
            var existingItem = GetMany(t => t.StateId == state.StateId).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateState(existingItem, state);
            }
            else
            {
                return InsertState(state);
            }
        }

        public State InsertState(State state)
        {
            var newItem = Add(state);
            SaveAsync();

            return newItem;
        }

        public State UpdateState(State existingItem, State state)
        {
            UpdateAsync(existingItem, existingItem.StateId);
            SaveAsync();

            return existingItem;
        }

        public List<State> GetAllState(long userId, long countryId)
        {
            return GetMany(x => x.CountryId == countryId).Result.ToList(); 
        }

        public State GetStateById(int stateId)
        {
            return GetMany(x => x.StateId == stateId).Result.FirstOrDefault();
        }
    }

    public partial interface IStateService : IService<State>
    {
        State CheckInsertOrUpdate(State state);

        List<State> GetAllState(long userId, long countryId);

        State GetStateById(int stateId);
    }
}


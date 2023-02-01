using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {
    public partial class TempMasterDataService : ServiceBase<TempMasterData>, ITempMasterDataService {
        public TempMasterDataService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) { }
        public List<TempMasterData> GetAllTempMasterData () {
            return GetAllAsync ().Result.ToList ();
        }

        public List<TempMasterData> InsertTempMasterDataList (List<TempMasterData> tempMasterDataList) {
            foreach (var item in tempMasterDataList) {
                var newItem = Add (item);
            }
            SaveAsync ();

            return tempMasterDataList;
        }
    }

    public partial interface ITempMasterDataService : IService<TempMasterData> {
        List<TempMasterData> GetAllTempMasterData ();
        List<TempMasterData> InsertTempMasterDataList (List<TempMasterData> tempMasterDataList);
    }
}
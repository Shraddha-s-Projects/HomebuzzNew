using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {
    public class MasterFileUploadService : ServiceBase<MasterFileUpload>, IMasterFileUploadService {
        public MasterFileUploadService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }

        public List<MasterFileUpload> GetAllMasterFiles () {
            return GetMany (t => t.IsDeleted == false).Result.ToList ();
        }

        public MasterFileUpload CheckInsertOrUpdate (MasterFileUpload Model) {
            var existingItem = GetMany (t => t.Id == Model.Id && t.IsDeleted == false).Result.FirstOrDefault ();
            if (existingItem != null) {
                return UpdateMasterFile (existingItem, Model);
            } else {
                Model.CreatedOn = DateTime.Now;
                return InsertMasterFile (Model);
            }
        }

        public MasterFileUpload InsertMasterFile (MasterFileUpload Model) {
			var newItem = Add (Model);
			SaveAsync ();

			return newItem;
		}
		public MasterFileUpload UpdateMasterFile (MasterFileUpload existingItem, MasterFileUpload Model) {
			UpdateAsync (Model, existingItem.Id);
			SaveAsync ();

			return existingItem;
		}
    }

    public partial interface IMasterFileUploadService : IService<MasterFileUpload> {
        List<MasterFileUpload> GetAllMasterFiles ();
        MasterFileUpload CheckInsertOrUpdate (MasterFileUpload Model);
    }
}
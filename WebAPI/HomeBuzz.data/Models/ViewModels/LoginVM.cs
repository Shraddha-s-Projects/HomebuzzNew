using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models {
    public class LoginVM {
        public long UserId { get; set; }

        public string EncryptedUserId { get; set; }

        public string RoleName { get; set; }

        public int? RoleId { get; set; }

        public string access_token { get; set; }

        public string UserName { get; set; }

        public bool IsSetupWizard { get; set; }

        public bool IsSignUpFinished { get; set; }

        public string Entity { get; set; }

        public int?[] PropertyDetailIds { get; set; }

        public List<PropertyViewerVM> PropertyViwer { get; set; }
    }

    public class PropertyViewerVM {

        public int? PropertyDetailId { get; set; }

        public string UserKey { get; set; }

        public DateTime ViewDate { get; set; }
    }
}
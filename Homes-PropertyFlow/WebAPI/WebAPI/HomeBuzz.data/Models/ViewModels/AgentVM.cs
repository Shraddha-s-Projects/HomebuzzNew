using System.Collections.Generic;
using HomeBuzz.data.ViewModels;

namespace HomeBuzz.data.Models.ViewModels
{
    public class AgentVM
    {
         public long Id { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string InviteCode { get; set; }

        public string Entity { get; set; }

        public string ProfilePicPath { get; set; }

        public string Title { get; set; }
        public string CompanyName { get; set; }
        public int? Company { get; set; }

        public long DateFormatId { get; set; }

        public bool IsUserAlreadyExist { get; set; }

        public bool IsEmailValid { get; set; } = true;

        public int RoleId { get; set; }
        public bool IsSuccessSignUp { get; set; }
        public string Coockie { get; set; }

        public string[] PropertyDetailIds { get; set; }

        public List<HomeCoockie> Homes { get; set; }
        public int? NoOfAgent { get; set; }
        public SubscriptionPlanVM SubscriptionPlan { get; set; }
    }
}
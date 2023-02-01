using System.Collections.Generic;

namespace HomeBuzz.data.Models.ViewModels {
    public class HotPropertyFlowInterestVM {
        public int? PropertyDetailId { get; set; }
        public List<PropertyFlowInterestVM> FlowInterest { get; set; }
    }
}
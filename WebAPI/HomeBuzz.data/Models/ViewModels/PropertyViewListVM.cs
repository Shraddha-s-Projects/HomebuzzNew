using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels {
	public class PropertyViewListVM {
		public int Id { get; set; }

		public int PropertyDetailId { get; set; }

		public string UserKey { get; set; }
		
		public int? UserId { get; set; }

		public DateTime ViewDate { get; set; }
	}
}
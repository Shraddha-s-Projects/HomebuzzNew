using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models.Tables {
	public class PropertyView {
		[Key, Required]
		public int Id { get; set; }

		public int? PropertyDetailId { get; set; }

		public long? UserId { get; set; }

		public DateTime ViewDate { get; set; }

		public string UserKey { get; set; }

		public DateTime? TimeWeightedViewDate { get; set; }

		public string TimeWeightedUserKey  { get; set; }
	}
}
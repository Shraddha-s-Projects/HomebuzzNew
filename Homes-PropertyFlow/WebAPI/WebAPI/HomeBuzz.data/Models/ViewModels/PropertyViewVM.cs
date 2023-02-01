using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels
{
	public class PropertyViewVM
	{
		public int Id { get; set; }

		public string[] PropertyDetailId { get; set; }

		public long? UserId { get; set; }

		public string UserKey { get; set; }

		public DateTime ViewDate { get; set; }
	}
}

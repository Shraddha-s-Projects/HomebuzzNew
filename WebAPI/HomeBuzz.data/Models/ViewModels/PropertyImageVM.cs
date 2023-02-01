using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models.ViewModels
{
	public class PropertyImageVM
	{
		public int Id { get; set; }
		
		public int? PropertyDetailId { get; set; }

		public string ImageName { get; set; }

	}
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBuzz.data.Models {
  public class PropertyDetail {
    [Key, Required]
    public int Id { get; set; }

    public int? PropertyId { get; set; }

    public long? OwnerId { get; set; }

    public bool IsActive { get; set; }

    public long ViewCount { get; set; }

    public bool IsClaimed { get; set; }

    public string Status { get; set; }

    public int? AgentOption { get; set; }

    public DateTime ActivatedDate { get; set; }

    public string Description { get; set; }

    public string Day { get; set; }

    public string Time { get; set; }

    public DateTime? ViewedDate { get; set; }

    public DateTime? OpenedDate { get; set; }

    public bool IsShowAskingPrice { get; set; }
    public bool IsOpenHome { get; set; }
    public int? StatusId { get; set; }

  }
}
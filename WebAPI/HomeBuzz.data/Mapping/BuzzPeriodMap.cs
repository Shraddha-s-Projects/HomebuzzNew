using System;
using System.Collections.Generic;
using System.Text;
using HomeBuzz.data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HomeBuzz.data.Mapping {
    public class BuzzPeriodMap {
        
        public BuzzPeriodMap (EntityTypeBuilder<BuzzPeriod> entity) {
            entity.ToTable ("BuzzPeriod");

            entity.HasKey (m => m.Id);
            entity.Property (t => t.Name).HasColumnName (@"Name").HasColumnType ("varchar(500)");
            entity.Property (t => t.Value).HasColumnName (@"Value").HasColumnType ("varchar(500)");
            entity.Property(t => t.IsDeleted).HasColumnName(@"IsDeleted").HasColumnType("bit").HasDefaultValueSql("0");
        }
    }
}
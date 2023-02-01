using HomeBuzz.data.Models.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Mapping
{
    public class PropertyViewMap
    {
        public PropertyViewMap(EntityTypeBuilder<PropertyView> entity)
        {
            entity.ToTable("PropertyView");

            entity.HasKey(m => m.Id);
            entity.Property(t => t.PropertyDetailId).HasColumnName(@"PropertyDetailId").HasColumnType("int");
            entity.Property(t => t.UserId).HasColumnName(@"UserId").HasColumnType("bigint");
            entity.Property(t => t.ViewDate).HasColumnName(@"ViewDate").HasColumnType("datetime");
            entity.Property(t => t.UserKey).HasColumnName(@"UserKey").HasColumnType("nvarchar(150)");
        }
    }
}

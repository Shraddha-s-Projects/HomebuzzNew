using System;
using System.Collections.Generic;
using System.Text;
using HomeBuzz.data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HomeBuzz.data.Mapping {
    public class PropertySearchHistoryMap {
        public PropertySearchHistoryMap (EntityTypeBuilder<PropertySearchHistory> entity) {
            entity.ToTable ("PropertySearchHistory");

            entity.HasKey (m => m.Id);
            entity.Property (t => t.PropertyId).HasColumnName (@"PropertyId").HasColumnType ("int");
            entity.Property (t => t.UserId).HasColumnName (@"UserId").HasColumnType ("bigint");
            entity.Property (t => t.Address).HasColumnName (@"Address").HasColumnType ("varchar(1000)");
            entity.Property (t => t.Bedrooms).HasColumnName (@"Bedrooms").HasColumnType ("varchar(500)");
            entity.Property (t => t.Bathrooms).HasColumnName (@"Bathrooms").HasColumnType ("varchar(500)");
            entity.Property (t => t.PropertyStatus).HasColumnName (@"PropertyStatus").HasColumnType ("varchar(1000)");
            entity.Property (t => t.MinPrice).HasColumnName (@"MinPrice").HasColumnType ("decimal(18,2)");
            entity.Property (t => t.MaxPrice).HasColumnName (@"MaxPrice").HasColumnType ("decimal(18,2)");
            entity.Property (t => t.FromTo).HasColumnName (@"FromTo").HasColumnType ("varchar(500)");
            entity.Property (t => t.CreatedOn).HasColumnName (@"CreatedOn").HasColumnType ("datetime").HasDefaultValueSql ("GETUTCDATE()");
            entity.Property (t => t.IsDeleted).HasColumnName (@"IsDeleted").HasColumnType ("bit").HasDefaultValueSql ("0");
            entity.Property (t => t.FromDate).HasColumnName (@"FromDate").HasColumnType ("datetime");
            entity.Property (t => t.ToDate).HasColumnName (@"ToDate").HasColumnType ("datetime");
        }
    }
}
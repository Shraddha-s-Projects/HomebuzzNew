using System;
using System.Collections.Generic;
using System.Text;
using HomeBuzz.data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HomeBuzz.data.Mapping {
    public class PropertyDataMap {
        
        public PropertyDataMap (EntityTypeBuilder<PropertyData> entity) {
            entity.ToTable ("PropertyData");

            entity.HasKey (m => m.Id);
            entity.Property (t => t.Address).HasColumnName (@"Address").HasColumnType ("varchar(1000)");
            entity.Property (t => t.Suburb).HasColumnName (@"Suburb").HasColumnType ("varchar(1000)");
            entity.Property (t => t.City).HasColumnName (@"City").HasColumnType ("varchar(1000)");
            entity.Property (t => t.HomebuzzEstimate).HasColumnName (@"HomebuzzEstimate").HasColumnType ("decimal(18,2)");
            entity.Property (t => t.Bedrooms).HasColumnName (@"Bedrooms").HasColumnType ("varchar(500)");
            entity.Property (t => t.Bathrooms).HasColumnName (@"Bathrooms").HasColumnType ("varchar(500)");
            entity.Property (t => t.CarSpace).HasColumnName (@"CarSpace").HasColumnType ("varchar(500)");
            entity.Property (t => t.Landarea).HasColumnName (@"Landarea").HasColumnType ("varchar(500)");
            entity.Property (t => t.LatitudeLongitude).HasColumnName (@"LatitudeLongitude").HasColumnType ("varchar(1000)");
            entity.Property(t => t.Latitude).HasColumnName(@"Latitude").HasColumnType("decimal(30,15)");
            entity.Property(t => t.Longitude).HasColumnName(@"Longitude").HasColumnType("decimal(30,15)");
            entity.Property (t => t.GoogleImage).HasColumnName (@"GoogleImage").HasColumnType ("varchar(1000)");
            entity.Property (t => t.BuildingType).HasColumnName (@"BuildingType").HasColumnType ("nvarchar(500)");
        }
    }
}
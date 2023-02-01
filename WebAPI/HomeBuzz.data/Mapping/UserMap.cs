using HomeBuzz.data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Mapping
{
    public class UserMap
    {
        public UserMap(EntityTypeBuilder<User> entity)
        {
            entity.ToTable("Users");

            entity.HasKey(m => m.UserId);
            entity.Property(t => t.UserName).HasColumnName(@"UserName").HasColumnType("varchar(500)");
            entity.Property(t => t.Email).HasColumnName(@"Email").IsRequired().HasColumnType("varchar(1000)");
            entity.Property(t => t.FirstName).HasColumnName(@"FirstName").HasColumnType("varchar(100)");
            entity.Property(t => t.LastName).HasColumnName(@"LastName").HasColumnType("varchar(100)");
            entity.Property(t => t.RoleId).HasColumnName(@"RoleId").HasColumnType("int");
            entity.Property(t => t.Password).HasColumnName(@"Password").IsRequired().HasColumnType("varchar(max)");
            entity.Property(t => t.IsActive).HasColumnName(@"IsActive").IsRequired().HasColumnType("bit").HasDefaultValueSql("0");
            entity.Property(t => t.LastUpdatedOn).HasColumnName(@"LastUpdatedOn").HasColumnType("datetime");
            entity.Property(t => t.CreatedOn).HasColumnName(@"CreatedOn").HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");
            entity.Property(t => t.IsDeleted).HasColumnName(@"IsDeleted").HasColumnType("bit").HasDefaultValueSql("0");
            entity.Property(t => t.DeletedOn).HasColumnName(@"DeletedOn").HasColumnType("datetime");
        }
    }
}

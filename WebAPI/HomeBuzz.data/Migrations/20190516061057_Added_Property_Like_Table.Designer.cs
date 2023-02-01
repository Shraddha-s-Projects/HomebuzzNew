﻿// <auto-generated />
using System;
using HomeBuzz.data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HomeBuzz.data.Migrations
{
    [DbContext(typeof(HomeBuzzContext))]
    [Migration("20190516061057_Added_Property_Like_Table")]
    partial class Added_Property_Like_Table
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.2-servicing-10034")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("HomeBuzz.data.Models.EmailTemplate", b =>
                {
                    b.Property<long>("EmailTemplateId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<DateTime?>("DeletedOn");

                    b.Property<string>("Description");

                    b.Property<bool?>("IsDeleted");

                    b.Property<string>("TemplateCode")
                        .HasMaxLength(5);

                    b.Property<string>("TemplateHtml");

                    b.Property<string>("TemplateName")
                        .HasMaxLength(100);

                    b.Property<DateTime?>("UpdatedOn");

                    b.HasKey("EmailTemplateId");

                    b.ToTable("EmailTemplate");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.ErrorLog", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("CreatedTime");

                    b.Property<string>("InnerException");

                    b.Property<string>("Message");

                    b.Property<string>("Source");

                    b.Property<string>("StackTrace");

                    b.Property<string>("TargetSite");

                    b.Property<int?>("UserID");

                    b.HasKey("ID");

                    b.ToTable("ErrorLog");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.Notification", b =>
                {
                    b.Property<long>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("DeletedOn");

                    b.Property<string>("Description");

                    b.Property<long>("FromUserId");

                    b.Property<string>("FromUserName")
                        .HasMaxLength(50);

                    b.Property<bool?>("IsDeleted");

                    b.Property<bool?>("IsNotificationRead");

                    b.Property<DateTime?>("NotificationReadOn");

                    b.Property<DateTime>("NotificationTime");

                    b.Property<string>("NotificationType")
                        .HasMaxLength(50);

                    b.Property<long>("ToUserId");

                    b.Property<string>("ToUserName")
                        .HasMaxLength(50);

                    b.Property<string>("ToastContent");

                    b.HasKey("NotificationId");

                    b.ToTable("Notification");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("ClaimedOn");

                    b.Property<bool>("IsReadTerms");

                    b.Property<long?>("OwnerId");

                    b.Property<int?>("PropertyDetailsId");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("PropertyDetailsId");

                    b.ToTable("PropertyClaim");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address");

                    b.Property<string>("Bathrooms");

                    b.Property<string>("Bedrooms");

                    b.Property<string>("Carparks");

                    b.Property<decimal?>("HomebuzzEstimate");

                    b.Property<string>("Landarea");

                    b.Property<string>("LatitudeLongitude");

                    b.HasKey("Id");

                    b.ToTable("PropertyData");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyDetail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("ActivatedDate");

                    b.Property<string>("ImageURL");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsClaimed");

                    b.Property<long?>("OwnerId");

                    b.Property<int?>("PropertyId");

                    b.Property<string>("Status");

                    b.Property<long>("ViewCount");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("PropertyId");

                    b.ToTable("PropertyDetail");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyLike", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("LikedOn");

                    b.Property<int?>("PropertyDetailsId");

                    b.Property<long?>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("PropertyDetailsId");

                    b.HasIndex("UserId");

                    b.ToTable("PropertyLike");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyOffer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("OfferedOn");

                    b.Property<decimal>("OfferingAmount");

                    b.Property<int?>("PropertyDetailsId");

                    b.Property<string>("Status");

                    b.Property<long?>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("PropertyDetailsId");

                    b.HasIndex("UserId");

                    b.ToTable("PropertyOffer");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.SystemSetting", b =>
                {
                    b.Property<int>("SystemSettingId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code")
                        .HasMaxLength(5);

                    b.Property<long?>("CreatedBy");

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<DateTime?>("DeletedOn");

                    b.Property<string>("Description")
                        .HasMaxLength(100);

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsDeleted");

                    b.Property<long?>("LastModifiedBy");

                    b.Property<DateTime?>("LastModifiedOn");

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.Property<int>("SystemSettingCategoryId");

                    b.Property<string>("Value");

                    b.Property<int>("ValueTypeId");

                    b.HasKey("SystemSettingId");

                    b.ToTable("SystemSetting");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.SystemSettingCategory", b =>
                {
                    b.Property<int>("SystemSettingCateogoryId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code")
                        .HasMaxLength(4);

                    b.Property<long?>("CreatedBy");

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<DateTime?>("DeletedOn");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModifiedOn");

                    b.Property<int?>("SortOrder");

                    b.Property<string>("SystemSettingCatName")
                        .HasMaxLength(50);

                    b.HasKey("SystemSettingCateogoryId");

                    b.ToTable("SystemSettingCategory");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.User", b =>
                {
                    b.Property<long>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedOn")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("CreatedOn")
                        .HasColumnType("datetime")
                        .HasDefaultValueSql("GETUTCDATE()");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnName("DeletedOn")
                        .HasColumnType("datetime");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnName("Email")
                        .HasColumnType("varchar(max)");

                    b.Property<DateTime?>("EmailVerifiedOn");

                    b.Property<string>("FirstName")
                        .HasColumnName("FirstName")
                        .HasColumnType("varchar(100)");

                    b.Property<bool>("IsActive")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("IsActive")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("0");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("IsDeleted")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("0");

                    b.Property<bool>("IsEmailVerified");

                    b.Property<string>("LastName")
                        .HasColumnName("LastName")
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime?>("LastUpdatedOn")
                        .HasColumnName("LastUpdatedOn")
                        .HasColumnType("datetime");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnName("Password")
                        .HasColumnType("varchar(max)");

                    b.Property<string>("PasswordHint");

                    b.Property<int?>("Pin")
                        .HasMaxLength(6);

                    b.Property<string>("ProfilePicPath");

                    b.Property<Guid>("UserGUID");

                    b.Property<string>("UserName")
                        .HasColumnName("UserName")
                        .HasColumnType("varchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.UserPasswordHistory", b =>
                {
                    b.Property<long>("UserPasswordHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<string>("Email");

                    b.Property<string>("Password");

                    b.Property<long>("UserId");

                    b.HasKey("UserPasswordHistoryId");

                    b.ToTable("UserPasswordHistory");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.VerificationCode", b =>
                {
                    b.Property<long>("VerificationCodeId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code")
                        .HasMaxLength(10);

                    b.Property<DateTime>("CreatedOn");

                    b.Property<DateTime?>("DeletedOn");

                    b.Property<string>("Email");

                    b.Property<DateTime?>("ExpiredOn");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("IsExpired");

                    b.Property<bool>("IsUsed");

                    b.Property<DateTime?>("UpdatedOn");

                    b.Property<long?>("UserId");

                    b.Property<string>("VerificationFor")
                        .HasMaxLength(50);

                    b.HasKey("VerificationCodeId");

                    b.ToTable("VerificationCode");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyClaim", b =>
                {
                    b.HasOne("HomeBuzz.data.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.HasOne("HomeBuzz.data.Models.PropertyDetail", "PropertyDetail")
                        .WithMany()
                        .HasForeignKey("PropertyDetailsId");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyDetail", b =>
                {
                    b.HasOne("HomeBuzz.data.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.HasOne("HomeBuzz.data.Models.PropertyData", "PropertyData")
                        .WithMany()
                        .HasForeignKey("PropertyId");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyLike", b =>
                {
                    b.HasOne("HomeBuzz.data.Models.PropertyDetail", "PropertyDetail")
                        .WithMany()
                        .HasForeignKey("PropertyDetailsId");

                    b.HasOne("HomeBuzz.data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyOffer", b =>
                {
                    b.HasOne("HomeBuzz.data.Models.PropertyDetail", "PropertyDetail")
                        .WithMany()
                        .HasForeignKey("PropertyDetailsId");

                    b.HasOne("HomeBuzz.data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });
#pragma warning restore 612, 618
        }
    }
}

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
    [Migration("20200506060532_Add_Price_Column_In_SubscriptionplanDetail_20200506")]
    partial class Add_Price_Column_In_SubscriptionplanDetail_20200506
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("HomeBuzz.data.Models.BuzzPeriod", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("IsDeleted")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("0");

                    b.Property<string>("Name")
                        .HasColumnName("Name")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("Value")
                        .HasColumnName("Value")
                        .HasColumnType("varchar(500)");

                    b.HasKey("Id");

                    b.ToTable("BuzzPeriod");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<string>("Email");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<string>("PhoneNo");

                    b.Property<DateTime?>("UpdatedOn");

                    b.HasKey("Id");

                    b.ToTable("Company");
                });

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

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyAction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Action");

                    b.Property<bool>("IsDeleted");

                    b.HasKey("Id");

                    b.ToTable("PropertyAction");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyAgent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AgentOptionId");

                    b.Property<decimal?>("AppraisalPrice");

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<long?>("OwnerId");

                    b.Property<int?>("PropertyDetailId");

                    b.Property<DateTime?>("UpdatedOn");

                    b.HasKey("Id");

                    b.ToTable("PropertyAgent");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("ClaimedOn");

                    b.Property<bool>("IsReadTerms");

                    b.Property<long?>("OwnerId");

                    b.Property<int?>("PropertyDetailId");

                    b.HasKey("Id");

                    b.ToTable("PropertyClaim");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyCrudData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address")
                        .HasColumnName("Address")
                        .HasColumnType("varchar(1000)");

                    b.Property<decimal?>("AskingPrice")
                        .HasColumnName("AskingPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Bathrooms")
                        .HasColumnName("Bathrooms")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("Bedrooms")
                        .HasColumnName("Bedrooms")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("BuildingType")
                        .HasColumnName("BuildingType")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Carparks")
                        .HasColumnName("Carparks")
                        .HasColumnType("varchar(500)");

                    b.Property<decimal?>("HomebuzzEstimate")
                        .HasColumnName("HomebuzzEstimate")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Landarea")
                        .HasColumnName("Landarea")
                        .HasColumnType("varchar(500)");

                    b.Property<decimal?>("Latitude")
                        .HasColumnName("Latitude")
                        .HasColumnType("decimal(30,15)");

                    b.Property<string>("LatitudeLongitude")
                        .HasColumnName("LatitudeLongitude")
                        .HasColumnType("varchar(1000)");

                    b.Property<decimal?>("Longitude")
                        .HasColumnName("Longitude")
                        .HasColumnType("decimal(30,15)");

                    b.Property<int?>("PropertyDetailId");

                    b.HasKey("Id");

                    b.ToTable("PropertyCrudData");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address")
                        .HasColumnName("Address")
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("Bathrooms")
                        .HasColumnName("Bathrooms")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("Bedrooms")
                        .HasColumnName("Bedrooms")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("BuildingType")
                        .HasColumnName("BuildingType")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Carparks")
                        .HasColumnName("Carparks")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("GoogleImage")
                        .HasColumnName("GoogleImage")
                        .HasColumnType("varchar(1000)");

                    b.Property<decimal?>("HomebuzzEstimate")
                        .HasColumnName("HomebuzzEstimate")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Landarea")
                        .HasColumnName("Landarea")
                        .HasColumnType("varchar(500)");

                    b.Property<decimal?>("Latitude")
                        .HasColumnName("Latitude")
                        .HasColumnType("decimal(30,15)");

                    b.Property<string>("LatitudeLongitude")
                        .HasColumnName("LatitudeLongitude")
                        .HasColumnType("varchar(1000)");

                    b.Property<decimal?>("Longitude")
                        .HasColumnName("Longitude")
                        .HasColumnType("decimal(30,15)");

                    b.HasKey("Id");

                    b.ToTable("PropertyData");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyDetail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("ActivatedDate");

                    b.Property<int?>("AgentOption");

                    b.Property<string>("Day");

                    b.Property<string>("Description");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsClaimed");

                    b.Property<bool>("IsOpenHome");

                    b.Property<bool>("IsShowAskingPrice");

                    b.Property<DateTime?>("OpenedDate");

                    b.Property<long?>("OwnerId");

                    b.Property<int?>("PropertyId");

                    b.Property<string>("Status");

                    b.Property<int?>("StatusId");

                    b.Property<string>("Time");

                    b.Property<long>("ViewCount");

                    b.Property<DateTime?>("ViewedDate");

                    b.HasKey("Id");

                    b.ToTable("PropertyDetail");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ImageName");

                    b.Property<int?>("PropertyDetailId");

                    b.HasKey("Id");

                    b.ToTable("PropertyImage");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyLike", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("LikedOn");

                    b.Property<int?>("PropertyDetailId");

                    b.Property<long?>("UserId");

                    b.HasKey("Id");

                    b.ToTable("PropertyLike");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyNotify", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("PropertyDetailId");

                    b.Property<long?>("UserId");

                    b.HasKey("Id");

                    b.ToTable("PropertyNotify");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyOffer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("OfferedOn");

                    b.Property<decimal>("OfferingAmount");

                    b.Property<int?>("PropertyDetailId");

                    b.Property<string>("Status");

                    b.Property<long?>("UserId");

                    b.HasKey("Id");

                    b.ToTable("PropertyOffer");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyOwnershipHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("Action");

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<long?>("FromOwnerId");

                    b.Property<int?>("PropertyDetailId");

                    b.Property<int?>("PropertyId");

                    b.Property<long?>("ToOwnerId");

                    b.HasKey("Id");

                    b.ToTable("PropertyOwnershipHistory");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertySearchHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address")
                        .HasColumnName("Address")
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("Bathrooms")
                        .HasColumnName("Bathrooms")
                        .HasColumnType("varchar(500)");

                    b.Property<string>("Bedrooms")
                        .HasColumnName("Bedrooms")
                        .HasColumnType("varchar(500)");

                    b.Property<DateTime>("CreatedOn")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("CreatedOn")
                        .HasColumnType("datetime")
                        .HasDefaultValueSql("GETUTCDATE()");

                    b.Property<DateTime?>("FromDate")
                        .HasColumnName("FromDate")
                        .HasColumnType("datetime");

                    b.Property<string>("FromTo")
                        .HasColumnName("FromTo")
                        .HasColumnType("varchar(500)");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("IsDeleted")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("0");

                    b.Property<bool>("IsExactMatchBath");

                    b.Property<bool>("IsExactMatchBed");

                    b.Property<decimal?>("MaxPrice")
                        .HasColumnName("MaxPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal?>("MinPrice")
                        .HasColumnName("MinPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int?>("PropertyId")
                        .HasColumnName("PropertyId")
                        .HasColumnType("int");

                    b.Property<string>("PropertyStatus")
                        .HasColumnName("PropertyStatus")
                        .HasColumnType("varchar(1000)");

                    b.Property<DateTime?>("ToDate")
                        .HasColumnName("ToDate")
                        .HasColumnType("datetime");

                    b.Property<long?>("UserId")
                        .HasColumnName("UserId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.ToTable("PropertySearchHistory");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.PropertyStatus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("PropertyStatus");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.SubscriptionPlan", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<DateTime?>("UpdatedOn");

                    b.HasKey("Id");

                    b.ToTable("SubscriptionPlan");
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

            modelBuilder.Entity("HomeBuzz.data.Models.Tables.AgentOption", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Option");

                    b.HasKey("Id");

                    b.ToTable("AgentOption");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.Tables.PropertyView", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("PropertyDetailId")
                        .HasColumnName("PropertyDetailId")
                        .HasColumnType("int");

                    b.Property<long?>("UserId")
                        .HasColumnName("UserId")
                        .HasColumnType("bigint");

                    b.Property<string>("UserKey")
                        .HasColumnName("UserKey")
                        .HasColumnType("nvarchar(150)");

                    b.Property<DateTime>("ViewDate")
                        .HasColumnName("ViewDate")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.ToTable("PropertyView");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.Tables.SubscriptionPlanDetail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Agents");

                    b.Property<DateTime?>("CreatedOn");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("IsFindAgentListing");

                    b.Property<bool>("IsListingReferrals");

                    b.Property<bool>("IsMetricsAndAnalytics");

                    b.Property<bool>("IsRealtimeMarketUpdates");

                    b.Property<bool>("IsReporting");

                    b.Property<bool>("IsSalesLeadsAndTracking");

                    b.Property<string>("NetWorkDashboard");

                    b.Property<decimal?>("Price");

                    b.Property<int?>("SubscriptionPlan");

                    b.Property<int?>("TrialPeriod");

                    b.Property<DateTime?>("UpdatedOn");

                    b.HasKey("Id");

                    b.ToTable("SubscriptionPlanDetail");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.Tables.UserRoles", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Role");

                    b.HasKey("Id");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("HomeBuzz.data.Models.User", b =>
                {
                    b.Property<long>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("Company");

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
                        .HasColumnType("varchar(1000)");

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

                    b.Property<int?>("RoleId")
                        .HasColumnName("RoleId")
                        .HasColumnType("int");

                    b.Property<int?>("SubscriptionPlan");

                    b.Property<Guid>("UserGUID");

                    b.Property<string>("UserName")
                        .HasColumnName("UserName")
                        .HasColumnType("varchar(500)");

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
#pragma warning restore 612, 618
        }
    }
}

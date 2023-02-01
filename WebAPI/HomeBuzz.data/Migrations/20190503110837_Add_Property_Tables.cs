using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Property_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PropertyData",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(nullable: true),
                    HomebuzzEstimate = table.Column<decimal>(nullable: true),
                    Bedrooms = table.Column<string>(nullable: true),
                    Bathrooms = table.Column<string>(nullable: true),
                    Carparks = table.Column<string>(nullable: true),
                    Landarea = table.Column<string>(nullable: true),
                    LatitudeLongitude = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyData", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyDetail",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyId = table.Column<int>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    ViewCount = table.Column<long>(nullable: false),
                    ImageURL = table.Column<string>(nullable: true),
                    IsClaimed = table.Column<bool>(nullable: false),
                    Status = table.Column<string>(nullable: true),
                    ActivatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyDetail_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyDetail_PropertyData_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "PropertyData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyClaim",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyDetailsId = table.Column<int>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true),
                    ClaimedOn = table.Column<DateTime>(nullable: false),
                    IsReadTerms = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyClaim_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyClaim_PropertyDetail_PropertyDetailsId",
                        column: x => x.PropertyDetailsId,
                        principalTable: "PropertyDetail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyOffer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyDetailsId = table.Column<int>(nullable: true),
                    UserId = table.Column<long>(nullable: true),
                    OfferedOn = table.Column<DateTime>(nullable: false),
                    OfferingAmount = table.Column<decimal>(nullable: false),
                    Status = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyOffer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyOffer_PropertyDetail_PropertyDetailsId",
                        column: x => x.PropertyDetailsId,
                        principalTable: "PropertyDetail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyOffer_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClaim_OwnerId",
                table: "PropertyClaim",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClaim_PropertyDetailsId",
                table: "PropertyClaim",
                column: "PropertyDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyDetail_OwnerId",
                table: "PropertyDetail",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyDetail_PropertyId",
                table: "PropertyDetail",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyOffer_PropertyDetailsId",
                table: "PropertyOffer",
                column: "PropertyDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyOffer_UserId",
                table: "PropertyOffer",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyClaim");

            migrationBuilder.DropTable(
                name: "PropertyOffer");

            migrationBuilder.DropTable(
                name: "PropertyDetail");

            migrationBuilder.DropTable(
                name: "PropertyData");
        }
    }
}

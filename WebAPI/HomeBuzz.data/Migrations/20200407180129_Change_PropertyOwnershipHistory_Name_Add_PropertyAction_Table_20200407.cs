using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Change_PropertyOwnershipHistory_Name_Add_PropertyAction_Table_20200407 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TransferOwnerHistory");

            migrationBuilder.CreateTable(
                name: "PropertyAction",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Action = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyAction", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyOwnershipHistory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    FromOwnerId = table.Column<int>(nullable: true),
                    ToOwnerId = table.Column<int>(nullable: true),
                    Action = table.Column<int>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyOwnershipHistory", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyAction");

            migrationBuilder.DropTable(
                name: "PropertyOwnershipHistory");

            migrationBuilder.CreateTable(
                name: "TransferOwnerHistory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedOn = table.Column<DateTime>(nullable: true),
                    FromOwnerId = table.Column<int>(nullable: true),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    ToOwnerId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferOwnerHistory", x => x.Id);
                });
        }
    }
}

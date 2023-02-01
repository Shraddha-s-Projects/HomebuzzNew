using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_PropertyFlowInterest_Table_20201014 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PropertyFlowInterest",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyId = table.Column<int>(nullable: true),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    Ranking = table.Column<int>(nullable: true),
                    ComparativeInterest = table.Column<int>(nullable: true),
                    ViewBlock = table.Column<int>(nullable: true),
                    PerformanceRange = table.Column<int>(nullable: true),
                    HigherPerformanceRange = table.Column<int>(nullable: true),
                    LowerPerformanceRange = table.Column<int>(nullable: true),
                    Performance = table.Column<string>(nullable: true),
                    ViewerStrength = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyFlowInterest", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyFlowInterest");
        }
    }
}

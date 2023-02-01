using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Table_WeeklyPropertyFlowInterest_And_EveryDayPropertyFlowInterest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EveryDayPropertyFlowInterest",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    RankingStatus = table.Column<string>(nullable: true),
                    Ranking = table.Column<int>(nullable: true),
                    ComparativeInterest = table.Column<int>(nullable: true),
                    ViewBlock = table.Column<int>(nullable: true),
                    ViewCount = table.Column<int>(nullable: true),
                    PerformanceRange = table.Column<int>(nullable: true),
                    HigherPerformanceRange = table.Column<int>(nullable: true),
                    LowerPerformanceRange = table.Column<int>(nullable: true),
                    Performance = table.Column<string>(nullable: true),
                    ViewerStrength = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EveryDayPropertyFlowInterest", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeeklyPropertyFlowInterest",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    RankingStatus = table.Column<string>(nullable: true),
                    Ranking = table.Column<int>(nullable: true),
                    ComparativeInterest = table.Column<int>(nullable: true),
                    ViewBlock = table.Column<int>(nullable: true),
                    ViewCount = table.Column<int>(nullable: true),
                    PerformanceRange = table.Column<int>(nullable: true),
                    HigherPerformanceRange = table.Column<int>(nullable: true),
                    LowerPerformanceRange = table.Column<int>(nullable: true),
                    Performance = table.Column<string>(nullable: true),
                    ViewerStrength = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyPropertyFlowInterest", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EveryDayPropertyFlowInterest");

            migrationBuilder.DropTable(
                name: "WeeklyPropertyFlowInterest");
        }
    }
}

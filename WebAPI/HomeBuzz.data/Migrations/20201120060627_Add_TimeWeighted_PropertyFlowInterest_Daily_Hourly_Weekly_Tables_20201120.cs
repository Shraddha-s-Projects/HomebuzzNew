using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_TimeWeighted_PropertyFlowInterest_Daily_Hourly_Weekly_Tables_20201120 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EveryDayPropertyFlowInterest");

            migrationBuilder.DropTable(
                name: "PropertyFlowInterest");

            migrationBuilder.CreateTable(
                name: "TimeWeightedPropertyFlowInterestDaily",
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
                    table.PrimaryKey("PK_TimeWeightedPropertyFlowInterestDaily", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimeWeightedPropertyFlowInterestHourly",
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
                    table.PrimaryKey("PK_TimeWeightedPropertyFlowInterestHourly", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimeWeightedPropertyFlowInterestWeekly",
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
                    table.PrimaryKey("PK_TimeWeightedPropertyFlowInterestWeekly", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimeWeightedPropertyFlowInterestDaily");

            migrationBuilder.DropTable(
                name: "TimeWeightedPropertyFlowInterestHourly");

            migrationBuilder.DropTable(
                name: "TimeWeightedPropertyFlowInterestWeekly");

            migrationBuilder.CreateTable(
                name: "EveryDayPropertyFlowInterest",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ComparativeInterest = table.Column<int>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: true),
                    HigherPerformanceRange = table.Column<int>(nullable: true),
                    LowerPerformanceRange = table.Column<int>(nullable: true),
                    Performance = table.Column<string>(nullable: true),
                    PerformanceRange = table.Column<int>(nullable: true),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    Ranking = table.Column<int>(nullable: true),
                    RankingStatus = table.Column<string>(nullable: true),
                    ViewBlock = table.Column<int>(nullable: true),
                    ViewCount = table.Column<int>(nullable: true),
                    ViewerStrength = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EveryDayPropertyFlowInterest", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyFlowInterest",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ComparativeInterest = table.Column<int>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: true),
                    HigherPerformanceRange = table.Column<int>(nullable: true),
                    LowerPerformanceRange = table.Column<int>(nullable: true),
                    Performance = table.Column<string>(nullable: true),
                    PerformanceRange = table.Column<int>(nullable: true),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    Ranking = table.Column<int>(nullable: true),
                    RankingStatus = table.Column<string>(nullable: true),
                    ViewBlock = table.Column<int>(nullable: true),
                    ViewCount = table.Column<int>(nullable: true),
                    ViewerStrength = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyFlowInterest", x => x.Id);
                });
        }
    }
}

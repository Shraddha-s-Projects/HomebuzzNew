using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_RankingStatus_And_ViewCount_Column_Into_PropertyFlowInterest_Table_20201014 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PropertyId",
                table: "PropertyFlowInterest",
                newName: "ViewCount");

            migrationBuilder.AddColumn<string>(
                name: "RankingStatus",
                table: "PropertyFlowInterest",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RankingStatus",
                table: "PropertyFlowInterest");

            migrationBuilder.RenameColumn(
                name: "ViewCount",
                table: "PropertyFlowInterest",
                newName: "PropertyId");
        }
    }
}

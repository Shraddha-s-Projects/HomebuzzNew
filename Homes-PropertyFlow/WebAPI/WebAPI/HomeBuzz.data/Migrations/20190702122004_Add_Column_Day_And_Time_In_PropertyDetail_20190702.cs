using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Column_Day_And_Time_In_PropertyDetail_20190702 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Day",
                table: "PropertyDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "PropertyDetail",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Day",
                table: "PropertyDetail");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "PropertyDetail");
        }
    }
}

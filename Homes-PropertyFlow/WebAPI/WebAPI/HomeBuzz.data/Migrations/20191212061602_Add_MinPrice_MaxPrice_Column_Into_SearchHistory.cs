using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_MinPrice_MaxPrice_Column_Into_SearchHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PropertyStatusId",
                table: "PropertySearchHistory");

            migrationBuilder.AddColumn<decimal>(
                name: "MaxPrice",
                table: "PropertySearchHistory",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinPrice",
                table: "PropertySearchHistory",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyStatus",
                table: "PropertySearchHistory",
                type: "varchar(1000)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxPrice",
                table: "PropertySearchHistory");

            migrationBuilder.DropColumn(
                name: "MinPrice",
                table: "PropertySearchHistory");

            migrationBuilder.DropColumn(
                name: "PropertyStatus",
                table: "PropertySearchHistory");

            migrationBuilder.AddColumn<int>(
                name: "PropertyStatusId",
                table: "PropertySearchHistory",
                type: "int",
                nullable: true);
        }
    }
}

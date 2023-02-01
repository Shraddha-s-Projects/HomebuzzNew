using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Column_IsExactMatchBed_And_IsExactMatchBath_20191125 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsExactMatchBath",
                table: "PropertySearchHistory",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsExactMatchBed",
                table: "PropertySearchHistory",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsExactMatchBath",
                table: "PropertySearchHistory");

            migrationBuilder.DropColumn(
                name: "IsExactMatchBed",
                table: "PropertySearchHistory");
        }
    }
}

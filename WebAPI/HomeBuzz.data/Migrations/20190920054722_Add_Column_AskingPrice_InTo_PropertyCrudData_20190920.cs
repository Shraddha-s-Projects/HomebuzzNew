using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Column_AskingPrice_InTo_PropertyCrudData_20190920 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PropertDetailId",
                table: "PropertyImage",
                newName: "PropertyDetailId");

            migrationBuilder.AddColumn<decimal>(
                name: "AskingPrice",
                table: "PropertyCrudData",
                type: "decimal(18,2)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AskingPrice",
                table: "PropertyCrudData");

            migrationBuilder.RenameColumn(
                name: "PropertyDetailId",
                table: "PropertyImage",
                newName: "PropertDetailId");
        }
    }
}

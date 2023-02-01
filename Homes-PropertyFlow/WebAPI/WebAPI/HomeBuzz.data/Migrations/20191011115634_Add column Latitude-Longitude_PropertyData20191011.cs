using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class AddcolumnLatitudeLongitude_PropertyData20191011 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "PropertyData",
                type: "decimal(30,15)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "PropertyData",
                type: "decimal(30,15)",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "PropertyCrudData",
                type: "decimal(30,15)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1000)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "PropertyCrudData",
                type: "decimal(30,15)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1000)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "PropertyData");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "PropertyData");

            migrationBuilder.AlterColumn<string>(
                name: "Longitude",
                table: "PropertyCrudData",
                type: "varchar(1000)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(30,15)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Latitude",
                table: "PropertyCrudData",
                type: "varchar(1000)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(30,15)",
                oldNullable: true);
        }
    }
}

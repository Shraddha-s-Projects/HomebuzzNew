using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Suburb_City_Column_20200612 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Carparks",
                table: "TempMasterData",
                newName: "CarSpace");

            migrationBuilder.RenameColumn(
                name: "Carparks",
                table: "PropertyData",
                newName: "CarSpace");

            migrationBuilder.RenameColumn(
                name: "Carparks",
                table: "PropertyCrudData",
                newName: "CarSpace");

            migrationBuilder.RenameColumn(
                name: "Carparks",
                table: "InvalidPropertyData",
                newName: "Suburb");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "TempMasterData",
                type: "varchar(1000)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suburb",
                table: "TempMasterData",
                type: "varchar(1000)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "PropertyData",
                type: "varchar(1000)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suburb",
                table: "PropertyData",
                type: "varchar(1000)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "PropertyCrudData",
                type: "varchar(1000)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suburb",
                table: "PropertyCrudData",
                type: "varchar(1000)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarSpace",
                table: "InvalidPropertyData",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "InvalidPropertyData",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "TempMasterData");

            migrationBuilder.DropColumn(
                name: "Suburb",
                table: "TempMasterData");

            migrationBuilder.DropColumn(
                name: "City",
                table: "PropertyData");

            migrationBuilder.DropColumn(
                name: "Suburb",
                table: "PropertyData");

            migrationBuilder.DropColumn(
                name: "City",
                table: "PropertyCrudData");

            migrationBuilder.DropColumn(
                name: "Suburb",
                table: "PropertyCrudData");

            migrationBuilder.DropColumn(
                name: "CarSpace",
                table: "InvalidPropertyData");

            migrationBuilder.DropColumn(
                name: "City",
                table: "InvalidPropertyData");

            migrationBuilder.RenameColumn(
                name: "CarSpace",
                table: "TempMasterData",
                newName: "Carparks");

            migrationBuilder.RenameColumn(
                name: "CarSpace",
                table: "PropertyData",
                newName: "Carparks");

            migrationBuilder.RenameColumn(
                name: "CarSpace",
                table: "PropertyCrudData",
                newName: "Carparks");

            migrationBuilder.RenameColumn(
                name: "Suburb",
                table: "InvalidPropertyData",
                newName: "Carparks");
        }
    }
}

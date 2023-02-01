using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_InvalidPropertyData_Table_20200611 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LatitudeLongitude",
                table: "TempMasterData",
                type: "varchar(1000)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Landarea",
                table: "TempMasterData",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Carparks",
                table: "TempMasterData",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bedrooms",
                table: "TempMasterData",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bathrooms",
                table: "TempMasterData",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "TempMasterData",
                type: "varchar(1000)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "TempMasterData",
                type: "decimal(30,15)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "TempMasterData",
                type: "decimal(30,15)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MasterFileUpload",
                table: "TempMasterData",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InvalidPropertyData",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(nullable: true),
                    HomebuzzEstimate = table.Column<decimal>(nullable: true),
                    Bedrooms = table.Column<string>(nullable: true),
                    Bathrooms = table.Column<string>(nullable: true),
                    Carparks = table.Column<string>(nullable: true),
                    Landarea = table.Column<string>(nullable: true),
                    LatitudeLongitude = table.Column<string>(nullable: true),
                    MasterFileUpload = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvalidPropertyData", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvalidPropertyData");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "TempMasterData");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "TempMasterData");

            migrationBuilder.DropColumn(
                name: "MasterFileUpload",
                table: "TempMasterData");

            migrationBuilder.AlterColumn<string>(
                name: "LatitudeLongitude",
                table: "TempMasterData",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1000)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Landarea",
                table: "TempMasterData",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Carparks",
                table: "TempMasterData",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bedrooms",
                table: "TempMasterData",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bathrooms",
                table: "TempMasterData",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "TempMasterData",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1000)",
                oldNullable: true);
        }
    }
}

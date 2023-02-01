using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_TempMasterData_Table_20200610 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TempMasterData",
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
                    LatitudeLongitude = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TempMasterData", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TempMasterData");
        }
    }
}

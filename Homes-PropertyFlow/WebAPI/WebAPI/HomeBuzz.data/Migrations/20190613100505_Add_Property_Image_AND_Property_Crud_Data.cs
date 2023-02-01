using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Property_Image_AND_Property_Crud_Data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageURL",
                table: "PropertyDetail");

            migrationBuilder.CreateTable(
                name: "PropertyCrudData",
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
                    PropertyDetailId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyCrudData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyCrudData_PropertyDetail_PropertyDetailId",
                        column: x => x.PropertyDetailId,
                        principalTable: "PropertyDetail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PropertyImage",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertDetailId = table.Column<int>(nullable: true),
                    ImageName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyImage", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyCrudData_PropertyDetailId",
                table: "PropertyCrudData",
                column: "PropertyDetailId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyCrudData");

            migrationBuilder.DropTable(
                name: "PropertyImage");

            migrationBuilder.AddColumn<string>(
                name: "ImageURL",
                table: "PropertyDetail",
                nullable: true);
        }
    }
}

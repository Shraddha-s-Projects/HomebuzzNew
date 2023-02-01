using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_PropertyAgent_Table_20200325 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AgentOptionId",
                table: "PropertyDetail",
                newName: "AgentOption");

            migrationBuilder.CreateTable(
                name: "PropertyAgent",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PropertyDetailId = table.Column<int>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyAgent", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyAgent");

            migrationBuilder.RenameColumn(
                name: "AgentOption",
                table: "PropertyDetail",
                newName: "AgentOptionId");
        }
    }
}

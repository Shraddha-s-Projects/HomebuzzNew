using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class AddForeignKey_To_PropertyOffer_For_PropertyDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PropertyOffer_PropertyDetail_PropertyDetailsId",
                table: "PropertyOffer");

            migrationBuilder.DropIndex(
                name: "IX_PropertyOffer_PropertyDetailsId",
                table: "PropertyOffer");

            migrationBuilder.AddColumn<int>(
                name: "PropertyDetailId",
                table: "PropertyOffer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyOffer_PropertyDetailId",
                table: "PropertyOffer",
                column: "PropertyDetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyOffer_PropertyDetail_PropertyDetailId",
                table: "PropertyOffer",
                column: "PropertyDetailId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PropertyOffer_PropertyDetail_PropertyDetailId",
                table: "PropertyOffer");

            migrationBuilder.DropIndex(
                name: "IX_PropertyOffer_PropertyDetailId",
                table: "PropertyOffer");

            migrationBuilder.DropColumn(
                name: "PropertyDetailId",
                table: "PropertyOffer");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyOffer_PropertyDetailsId",
                table: "PropertyOffer",
                column: "PropertyDetailsId");

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyOffer_PropertyDetail_PropertyDetailsId",
                table: "PropertyOffer",
                column: "PropertyDetailsId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}

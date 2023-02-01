using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Remove_ForeignKey_In_AllTalbe_20190807 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PropertyClaim_Users_OwnerId",
                table: "PropertyClaim");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyClaim_PropertyDetail_PropertyDetailId",
                table: "PropertyClaim");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyCrudData_PropertyDetail_PropertyDetailId",
                table: "PropertyCrudData");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyDetail_Users_OwnerId",
                table: "PropertyDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyDetail_PropertyData_PropertyId",
                table: "PropertyDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyLike_PropertyDetail_PropertyDetailId",
                table: "PropertyLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyLike_Users_UserId",
                table: "PropertyLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyOffer_PropertyDetail_PropertyDetailId",
                table: "PropertyOffer");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyOffer_Users_UserId",
                table: "PropertyOffer");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyView_PropertyDetail_PropertyDetailId",
                table: "PropertyView");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyView_Users_UserId",
                table: "PropertyView");

            migrationBuilder.DropIndex(
                name: "IX_PropertyView_PropertyDetailId",
                table: "PropertyView");

            migrationBuilder.DropIndex(
                name: "IX_PropertyView_UserId",
                table: "PropertyView");

            migrationBuilder.DropIndex(
                name: "IX_PropertyOffer_PropertyDetailId",
                table: "PropertyOffer");

            migrationBuilder.DropIndex(
                name: "IX_PropertyOffer_UserId",
                table: "PropertyOffer");

            migrationBuilder.DropIndex(
                name: "IX_PropertyLike_PropertyDetailId",
                table: "PropertyLike");

            migrationBuilder.DropIndex(
                name: "IX_PropertyLike_UserId",
                table: "PropertyLike");

            migrationBuilder.DropIndex(
                name: "IX_PropertyDetail_OwnerId",
                table: "PropertyDetail");

            migrationBuilder.DropIndex(
                name: "IX_PropertyDetail_PropertyId",
                table: "PropertyDetail");

            migrationBuilder.DropIndex(
                name: "IX_PropertyCrudData_PropertyDetailId",
                table: "PropertyCrudData");

            migrationBuilder.DropIndex(
                name: "IX_PropertyClaim_OwnerId",
                table: "PropertyClaim");

            migrationBuilder.DropIndex(
                name: "IX_PropertyClaim_PropertyDetailId",
                table: "PropertyClaim");

            migrationBuilder.AlterColumn<int>(
                name: "PropertyDetailId",
                table: "PropertyCrudData",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PropertyDetailId",
                table: "PropertyCrudData",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyView_PropertyDetailId",
                table: "PropertyView",
                column: "PropertyDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyView_UserId",
                table: "PropertyView",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyOffer_PropertyDetailId",
                table: "PropertyOffer",
                column: "PropertyDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyOffer_UserId",
                table: "PropertyOffer",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyLike_PropertyDetailId",
                table: "PropertyLike",
                column: "PropertyDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyLike_UserId",
                table: "PropertyLike",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyDetail_OwnerId",
                table: "PropertyDetail",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyDetail_PropertyId",
                table: "PropertyDetail",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyCrudData_PropertyDetailId",
                table: "PropertyCrudData",
                column: "PropertyDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClaim_OwnerId",
                table: "PropertyClaim",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyClaim_PropertyDetailId",
                table: "PropertyClaim",
                column: "PropertyDetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyClaim_Users_OwnerId",
                table: "PropertyClaim",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyClaim_PropertyDetail_PropertyDetailId",
                table: "PropertyClaim",
                column: "PropertyDetailId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyCrudData_PropertyDetail_PropertyDetailId",
                table: "PropertyCrudData",
                column: "PropertyDetailId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyDetail_Users_OwnerId",
                table: "PropertyDetail",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyDetail_PropertyData_PropertyId",
                table: "PropertyDetail",
                column: "PropertyId",
                principalTable: "PropertyData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyLike_PropertyDetail_PropertyDetailId",
                table: "PropertyLike",
                column: "PropertyDetailId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyLike_Users_UserId",
                table: "PropertyLike",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyOffer_PropertyDetail_PropertyDetailId",
                table: "PropertyOffer",
                column: "PropertyDetailId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyOffer_Users_UserId",
                table: "PropertyOffer",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyView_PropertyDetail_PropertyDetailId",
                table: "PropertyView",
                column: "PropertyDetailId",
                principalTable: "PropertyDetail",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyView_Users_UserId",
                table: "PropertyView",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

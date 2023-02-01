using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class change_column_type_20200407 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "ToOwnerId",
                table: "PropertyOwnershipHistory",
                nullable: true,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "FromOwnerId",
                table: "PropertyOwnershipHistory",
                nullable: true,
                oldClrType: typeof(int),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ToOwnerId",
                table: "PropertyOwnershipHistory",
                nullable: true,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FromOwnerId",
                table: "PropertyOwnershipHistory",
                nullable: true,
                oldClrType: typeof(long),
                oldNullable: true);
        }
    }
}

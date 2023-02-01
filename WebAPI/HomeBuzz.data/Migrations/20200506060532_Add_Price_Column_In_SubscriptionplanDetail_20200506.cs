using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Price_Column_In_SubscriptionplanDetail_20200506 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Agents",
                table: "SubscriptionPlanDetail",
                nullable: true,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "SubscriptionPlanDetail",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "SubscriptionPlanDetail");

            migrationBuilder.AlterColumn<int>(
                name: "Agents",
                table: "SubscriptionPlanDetail",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}

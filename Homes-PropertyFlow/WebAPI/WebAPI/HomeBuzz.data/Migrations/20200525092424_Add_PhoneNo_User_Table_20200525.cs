using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_PhoneNo_User_Table_20200525 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhoneNo",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNo",
                table: "Users");
        }
    }
}

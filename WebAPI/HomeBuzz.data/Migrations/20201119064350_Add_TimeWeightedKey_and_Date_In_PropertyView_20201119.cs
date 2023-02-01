using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_TimeWeightedKey_and_Date_In_PropertyView_20201119 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TimeWeightedUserKey",
                table: "PropertyView",
                type: "nvarchar(150)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TimeWeightedViewDate",
                table: "PropertyView",
                type: "datetime",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeWeightedUserKey",
                table: "PropertyView");

            migrationBuilder.DropColumn(
                name: "TimeWeightedViewDate",
                table: "PropertyView");
        }
    }
}

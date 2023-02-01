using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Column_In_PropertyAgent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AgentOptionId",
                table: "PropertyAgent",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "PropertyAgent",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "PropertyAgent",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgentOptionId",
                table: "PropertyAgent");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "PropertyAgent");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "PropertyAgent");
        }
    }
}

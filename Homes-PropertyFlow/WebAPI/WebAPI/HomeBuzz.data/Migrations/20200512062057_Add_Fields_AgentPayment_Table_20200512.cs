using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeBuzz.data.Migrations
{
    public partial class Add_Fields_AgentPayment_Table_20200512 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "AgentPayment",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AgentPayment",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "AgentPayment",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "AgentPayment",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "AgentPayment");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AgentPayment");

            migrationBuilder.DropColumn(
                name: "State",
                table: "AgentPayment");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "AgentPayment");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectGames.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddConsolesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConsoleId",
                table: "Games",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Consoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Manufacturer = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ImageName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ReleaseYear = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consoles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_ConsoleId",
                table: "Games",
                column: "ConsoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Consoles_ConsoleId",
                table: "Games",
                column: "ConsoleId",
                principalTable: "Consoles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Consoles_ConsoleId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "Consoles");

            migrationBuilder.DropIndex(
                name: "IX_Games_ConsoleId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "ConsoleId",
                table: "Games");
        }
    }
}

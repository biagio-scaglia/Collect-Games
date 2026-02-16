using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectGames.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddWishlistAndReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCollection_Games_GameId",
                table: "UserCollection");

            migrationBuilder.DropIndex(
                name: "IX_Games_NormalizedTitle",
                table: "Games");

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserCollectionItemId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    ReviewText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReviewDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_UserCollection_UserCollectionItemId",
                        column: x => x.UserCollectionItemId,
                        principalTable: "UserCollection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Wishlist",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Platform = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PurchaseLink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EstimatedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wishlist", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserCollectionItemId",
                table: "Reviews",
                column: "UserCollectionItemId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCollection_Games_GameId",
                table: "UserCollection",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCollection_Games_GameId",
                table: "UserCollection");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Wishlist");

            migrationBuilder.CreateIndex(
                name: "IX_Games_NormalizedTitle",
                table: "Games",
                column: "NormalizedTitle");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCollection_Games_GameId",
                table: "UserCollection",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

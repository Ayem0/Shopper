using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace productservice.Migrations
{
    /// <inheritdoc />
    public partial class Third : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VariantOptionValues_ProductVariants_ProductVariantId",
                table: "VariantOptionValues");

            migrationBuilder.DropIndex(
                name: "IX_VariantOptionValues_ProductVariantId",
                table: "VariantOptionValues");

            migrationBuilder.DropColumn(
                name: "ProductVariantId",
                table: "VariantOptionValues");

            migrationBuilder.CreateTable(
                name: "ProductVariantVariantOptionValue",
                columns: table => new
                {
                    ProductVariantsId = table.Column<Guid>(type: "uuid", nullable: false),
                    VariantOptionValuesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariantVariantOptionValue", x => new { x.ProductVariantsId, x.VariantOptionValuesId });
                    table.ForeignKey(
                        name: "FK_ProductVariantVariantOptionValue_ProductVariants_ProductVar~",
                        column: x => x.ProductVariantsId,
                        principalTable: "ProductVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductVariantVariantOptionValue_VariantOptionValues_Varian~",
                        column: x => x.VariantOptionValuesId,
                        principalTable: "VariantOptionValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariantVariantOptionValue_VariantOptionValuesId",
                table: "ProductVariantVariantOptionValue",
                column: "VariantOptionValuesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductVariantVariantOptionValue");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductVariantId",
                table: "VariantOptionValues",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariantOptionValues_ProductVariantId",
                table: "VariantOptionValues",
                column: "ProductVariantId");

            migrationBuilder.AddForeignKey(
                name: "FK_VariantOptionValues_ProductVariants_ProductVariantId",
                table: "VariantOptionValues",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id");
        }
    }
}

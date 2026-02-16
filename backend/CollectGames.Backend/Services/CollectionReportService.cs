using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using CollectGames.Backend.Models;
using CollectGames.Backend.Data;

namespace CollectGames.Backend.Services
{
    public interface ICollectionReportService
    {
        byte[] GenerateCollectionPdf(IEnumerable<UserCollectionItem> items);
        byte[] GenerateWishlistPdf(IEnumerable<WishlistItem> items);
    }

    public class CollectionReportService : ICollectionReportService
    {
        public byte[] GenerateCollectionPdf(IEnumerable<UserCollectionItem> items)
        {
            // QuestPDF requirement: License configuration
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Verdana));

                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("CollectGames").FontSize(24).SemiBold().FontColor("#7B5FA6");
                            col.Item().Text("My Retro Gaming Collection").FontSize(14).FontColor(Colors.Grey.Medium);
                        });

                        row.RelativeItem().AlignRight().Column(col =>
                        {
                            col.Item().Text(DateTime.Now.ToString("dd/MM/yyyy")).FontSize(10);
                            col.Item().Text($"Items: {items.Count()}").FontSize(10);
                        });
                    });

                    page.Content().PaddingVertical(20).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(80); // Image
                            columns.RelativeColumn(3);  // Title
                            columns.RelativeColumn(2);  // Platform
                            columns.RelativeColumn(1.5f); // Condition
                            columns.RelativeColumn(1.5f); // Price
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Game");
                            header.Cell().Element(CellStyle).Text("Title");
                            header.Cell().Element(CellStyle).Text("Platform");
                            header.Cell().Element(CellStyle).Text("Condition");
                            header.Cell().Element(CellStyle).Text("Price");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                            }
                        });

                        foreach (var item in items)
                        {
                            table.Cell().PaddingVertical(5).MaxWidth(70).MaxHeight(70).Element(container => 
                            {
                                if (!string.IsNullOrEmpty(item.UserImagePath))
                                {
                                    var fullPath = Path.Combine("wwwroot", item.UserImagePath.TrimStart('/'));
                                    if (File.Exists(fullPath))
                                    {
                                        container.Image(fullPath).FitArea();
                                        return;
                                    }
                                }
                                container.AlignCenter().AlignMiddle().Text("No Image").FontSize(8).FontColor(Colors.Grey.Medium);
                            });
                            
                            table.Cell().Element(ContentStyle).Text(item.Game?.Title ?? "Unknown");
                            table.Cell().Element(ContentStyle).Text(item.Game?.Platform ?? "Unknown");
                            table.Cell().Element(ContentStyle).Text(item.Condition);
                            table.Cell().Element(ContentStyle).Text(item.PricePaid.HasValue ? $"€{item.PricePaid.Value:F2}" : "-");

                            static IContainer ContentStyle(IContainer container)
                            {
                                return container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten3);
                            }
                        }
                    });

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                    });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GenerateWishlistPdf(IEnumerable<WishlistItem> items)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Verdana));

                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("CollectGames").FontSize(24).SemiBold().FontColor("#7B5FA6");
                            col.Item().Text("My Gaming Wishlist").FontSize(14).FontColor(Colors.Grey.Medium);
                        });

                        row.RelativeItem().AlignRight().Column(col =>
                        {
                            col.Item().Text(DateTime.Now.ToString("dd/MM/yyyy")).FontSize(10);
                            col.Item().Text($"Items: {items.Count()}").FontSize(10);
                            var totalEstimated = items.Where(i => i.EstimatedPrice.HasValue).Sum(i => i.EstimatedPrice!.Value);
                            col.Item().Text($"Est. Total: €{totalEstimated:F2}").FontSize(10).SemiBold();
                        });
                    });

                    page.Content().PaddingVertical(20).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(80); // Image
                            columns.RelativeColumn(3);  // Title
                            columns.RelativeColumn(2);  // Platform
                            columns.RelativeColumn(1.5f); // Priority
                            columns.RelativeColumn(1.5f); // Est. Price
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Image");
                            header.Cell().Element(CellStyle).Text("Title");
                            header.Cell().Element(CellStyle).Text("Platform");
                            header.Cell().Element(CellStyle).Text("Priority");
                            header.Cell().Element(CellStyle).Text("Est. Price");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                            }
                        });

                        foreach (var item in items.OrderByDescending(i => i.Priority == "High" ? 3 : i.Priority == "Medium" ? 2 : 1))
                        {
                            table.Cell().PaddingVertical(5).MaxWidth(70).MaxHeight(70).Element(container =>
                            {
                                if (!string.IsNullOrEmpty(item.ImageUrl))
                                {
                                    var fullPath = Path.Combine("wwwroot", item.ImageUrl.TrimStart('/'));
                                    if (File.Exists(fullPath))
                                    {
                                        container.Image(fullPath).FitArea();
                                        return;
                                    }
                                }
                                container.AlignCenter().AlignMiddle().Text("No Image").FontSize(8).FontColor(Colors.Grey.Medium);
                            });

                            table.Cell().Element(ContentStyle).Text(item.Title);
                            table.Cell().Element(ContentStyle).Text(item.Platform);
                            
                            var priorityColor = item.Priority switch
                            {
                                "High" => Colors.Red.Medium,
                                "Medium" => Colors.Orange.Medium,
                                _ => Colors.Green.Medium
                            };
                            table.Cell().Element(ContentStyle).Text(item.Priority).FontColor(priorityColor).SemiBold();
                            table.Cell().Element(ContentStyle).Text(item.EstimatedPrice.HasValue ? $"€{item.EstimatedPrice.Value:F2}" : "-");

                            static IContainer ContentStyle(IContainer container)
                            {
                                return container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten3);
                            }
                        }
                    });

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                    });
                });
            });

            return document.GeneratePdf();
        }
    }
}

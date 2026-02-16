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
    }
}

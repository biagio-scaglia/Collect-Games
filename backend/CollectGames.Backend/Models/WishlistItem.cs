namespace CollectGames.Backend.Models;

public class WishlistItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? PurchaseLink { get; set; }
    public decimal? EstimatedPrice { get; set; }
    public string? Notes { get; set; }
    public string Priority { get; set; } = "Medium"; // Low, Medium, High
    public DateTime AddedDate { get; set; }
}

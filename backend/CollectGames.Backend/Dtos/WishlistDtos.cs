using System.ComponentModel.DataAnnotations;

namespace CollectGames.Backend.Dtos;

public class WishlistCreateDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Platform { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
    public string? PurchaseLink { get; set; }
    public decimal? EstimatedPrice { get; set; }
    public string? Notes { get; set; }
    public string Priority { get; set; } = "Medium";
}

public class WishlistUpdateDto
{
    public string? Title { get; set; }
    public string? Platform { get; set; }
    public string? ImageUrl { get; set; }
    public string? PurchaseLink { get; set; }
    public decimal? EstimatedPrice { get; set; }
    public string? Notes { get; set; }
    public string? Priority { get; set; }
}

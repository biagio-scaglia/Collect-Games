namespace CollectGames.Backend.Dtos;

public class UserCollectionUpdateDto
{
    public string? Condition { get; set; }
    public decimal? PricePaid { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? Notes { get; set; }
    public IFormFile? Image { get; set; }
}

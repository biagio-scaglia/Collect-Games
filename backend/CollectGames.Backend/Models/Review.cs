namespace CollectGames.Backend.Models;

public class Review
{
    public int Id { get; set; }
    public int UserCollectionItemId { get; set; }
    public UserCollectionItem UserCollectionItem { get; set; } = null!;
    public int Rating { get; set; } // 1-5
    public string ReviewText { get; set; } = string.Empty;
    public DateTime ReviewDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
}

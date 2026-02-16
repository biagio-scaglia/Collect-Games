using System.ComponentModel.DataAnnotations;

namespace CollectGames.Backend.Dtos
{
    public class UserCollectionCreateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Platform { get; set; } = string.Empty;

        public string? Condition { get; set; } = "Loose";
        public decimal? PricePaid { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? Notes { get; set; }

        public IFormFile? Image { get; set; }
    }
}

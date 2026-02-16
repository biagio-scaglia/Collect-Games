using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CollectGames.Backend.Models
{
    public class UserCollectionItem
    {
        public int Id { get; set; }

        public int GameId { get; set; }
        public Game? Game { get; set; }

        [MaxLength(20)]
        public string Condition { get; set; } = "Loose";

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? PricePaid { get; set; }

        public DateTime? PurchaseDate { get; set; }

        [MaxLength(500)]
        public string? UserImagePath { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    }
}

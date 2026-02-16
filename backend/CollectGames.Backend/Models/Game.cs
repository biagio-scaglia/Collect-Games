using System.ComponentModel.DataAnnotations;

namespace CollectGames.Backend.Models
{
    public class Game
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Platform { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? NormalizedTitle { get; set; }

        [MaxLength(200)]
        public string? WikipediaSlug { get; set; }

        public int? ReleaseYear { get; set; }
        
        public int? ConsoleId { get; set; }
        public Console? Console { get; set; }
    }
}

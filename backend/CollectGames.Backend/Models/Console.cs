using System.ComponentModel.DataAnnotations;

namespace CollectGames.Backend.Models
{
    public class Console
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Manufacturer { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Type { get; set; } = "Home"; // Home, Handheld, Hybrid

        [MaxLength(200)]
        public string? ImageName { get; set; }

        public int? ReleaseYear { get; set; }
        
        // Navigation property
        // Using System.Text.Json.Serialization to prevent cycle if not using DTOs for simple setup
        // [JsonIgnore] 
        // For now we will just not include it in serialization by default or use DTOs in controller
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }
}

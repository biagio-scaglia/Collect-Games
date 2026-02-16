using System.ComponentModel.DataAnnotations;

namespace CollectGames.Backend.Dtos;

public class ReviewCreateDto
{
    [Required]
    public int UserCollectionItemId { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string ReviewText { get; set; } = string.Empty;
}

public class ReviewUpdateDto
{
    [Range(1, 5)]
    public int? Rating { get; set; }

    [StringLength(1000, MinimumLength = 10)]
    public string? ReviewText { get; set; }
}

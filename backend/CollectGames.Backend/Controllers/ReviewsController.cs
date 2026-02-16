using CollectGames.Backend.Data;
using CollectGames.Backend.Dtos;
using CollectGames.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollectGames.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
    {
        return await _context.Reviews
            .Include(r => r.UserCollectionItem)
                .ThenInclude(u => u.Game)
            .OrderByDescending(r => r.ReviewDate)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.UserCollectionItem)
                .ThenInclude(u => u.Game)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound();

        return review;
    }

    [HttpGet("game/{userCollectionItemId}")]
    public async Task<ActionResult<Review>> GetReviewByGame(int userCollectionItemId)
    {
        var review = await _context.Reviews
            .Include(r => r.UserCollectionItem)
                .ThenInclude(u => u.Game)
            .FirstOrDefaultAsync(r => r.UserCollectionItemId == userCollectionItemId);

        if (review == null)
            return NotFound();

        return review;
    }

    [HttpPost]
    public async Task<ActionResult<Review>> CreateReview(ReviewCreateDto dto)
    {
        // Check if collection item exists
        var collectionItem = await _context.UserCollection
            .Include(u => u.Game)
            .FirstOrDefaultAsync(u => u.Id == dto.UserCollectionItemId);

        if (collectionItem == null)
            return BadRequest("Collection item not found");

        // Check if review already exists for this game
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.UserCollectionItemId == dto.UserCollectionItemId);

        if (existingReview != null)
            return BadRequest("A review already exists for this game");

        var review = new Review
        {
            UserCollectionItemId = dto.UserCollectionItemId,
            Rating = dto.Rating,
            ReviewText = dto.ReviewText,
            ReviewDate = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        review.UserCollectionItem = collectionItem;

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Review>> UpdateReview(int id, ReviewUpdateDto dto)
    {
        var review = await _context.Reviews
            .Include(r => r.UserCollectionItem)
                .ThenInclude(u => u.Game)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
            return NotFound();

        if (dto.Rating.HasValue)
            review.Rating = dto.Rating.Value;

        if (dto.ReviewText != null)
            review.ReviewText = dto.ReviewText;

        review.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(review);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
            return NotFound();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

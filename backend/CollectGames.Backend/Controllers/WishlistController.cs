using CollectGames.Backend.Data;
using CollectGames.Backend.Dtos;
using CollectGames.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollectGames.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly Services.IImageService _imageService;
    private readonly Services.ICollectionReportService _reportService;

    public WishlistController(AppDbContext context, Services.IImageService imageService, Services.ICollectionReportService reportService)
    {
        _context = context;
        _imageService = imageService;
        _reportService = reportService;
    }

    [HttpGet("export/pdf")]
    public async Task<IActionResult> ExportToPdf()
    {
        var items = await _context.Wishlist
            .OrderByDescending(w => w.AddedDate)
            .ToListAsync();

        var pdfBytes = _reportService.GenerateWishlistPdf(items);
        return File(pdfBytes, "application/pdf", $"CollectGames_Wishlist_{DateTime.Now:yyyyMMdd}.pdf");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WishlistItem>>> GetWishlist()
    {
        return await _context.Wishlist
            .OrderByDescending(w => w.AddedDate)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WishlistItem>> GetWishlistItem(int id)
    {
        var item = await _context.Wishlist.FindAsync(id);

        if (item == null)
            return NotFound();

        return item;
    }

    [HttpPost]
    public async Task<ActionResult<WishlistItem>> AddToWishlist([FromForm] WishlistCreateDto dto, IFormFile? image)
    {
        string? imagePath = dto.ImageUrl;

        if (image != null)
        {
            try 
            {
                imagePath = await _imageService.SaveImageAsync(image);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        var item = new WishlistItem
        {
            Title = dto.Title,
            Platform = dto.Platform,
            ImageUrl = imagePath,
            PurchaseLink = dto.PurchaseLink,
            EstimatedPrice = dto.EstimatedPrice,
            Notes = dto.Notes,
            Priority = dto.Priority,
            AddedDate = DateTime.UtcNow
        };

        _context.Wishlist.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWishlistItem), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WishlistItem>> UpdateWishlistItem(int id, [FromForm] WishlistUpdateDto dto, IFormFile? image)
    {
        var item = await _context.Wishlist.FindAsync(id);

        if (item == null)
            return NotFound();

        if (image != null)
        {
             try 
            {
                // Optionally delete old image if it was local
                var imagePath = await _imageService.SaveImageAsync(image);
                item.ImageUrl = imagePath;
            }
            catch (Exception)
            {
               // log error
            }
        }
        else if (dto.ImageUrl != null) 
        {
            item.ImageUrl = dto.ImageUrl;
        }

        if (dto.Title != null) item.Title = dto.Title;
        if (dto.Platform != null) item.Platform = dto.Platform;
        if (dto.PurchaseLink != null) item.PurchaseLink = dto.PurchaseLink;
        if (dto.EstimatedPrice.HasValue) item.EstimatedPrice = dto.EstimatedPrice;
        if (dto.Notes != null) item.Notes = dto.Notes;
        if (dto.Priority != null) item.Priority = dto.Priority;

        await _context.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWishlistItem(int id)
    {
        var item = await _context.Wishlist.FindAsync(id);

        if (item == null)
            return NotFound();

        _context.Wishlist.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/purchase")]
    public async Task<ActionResult<UserCollectionItem>> MarkAsPurchased(int id, [FromBody] UserCollectionCreateDto dto)
    {
        var wishlistItem = await _context.Wishlist.FindAsync(id);

        if (wishlistItem == null)
            return NotFound();

        // Create or find game
        var game = await _context.Games
            .FirstOrDefaultAsync(g => g.Title == wishlistItem.Title && g.Platform == wishlistItem.Platform);

        if (game == null)
        {
            game = new Game
            {
                Title = wishlistItem.Title,
                Platform = wishlistItem.Platform,
                NormalizedTitle = wishlistItem.Title.ToUpperInvariant()
            };
            _context.Games.Add(game);
            await _context.SaveChangesAsync();
        }

        // Create collection item
        var collectionItem = new UserCollectionItem
        {
            GameId = game.Id,
            Condition = dto.Condition ?? "Loose",
            PricePaid = dto.PricePaid ?? wishlistItem.EstimatedPrice,
            PurchaseDate = dto.PurchaseDate ?? DateTime.UtcNow,
            Notes = dto.Notes ?? wishlistItem.Notes,
            UserImagePath = wishlistItem.ImageUrl,
            AddedDate = DateTime.UtcNow
        };

        _context.UserCollection.Add(collectionItem);

        // Remove from wishlist
        _context.Wishlist.Remove(wishlistItem);

        await _context.SaveChangesAsync();

        collectionItem.Game = game;

        return CreatedAtAction("GetCollection", "UserCollection", new { id = collectionItem.Id }, collectionItem);
    }
}

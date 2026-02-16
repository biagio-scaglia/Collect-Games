using CollectGames.Backend.Data;
using CollectGames.Backend.Dtos;
using CollectGames.Backend.Models;
using CollectGames.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollectGames.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCollectionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IImageService _imageService;
        private readonly ICollectionReportService _reportService;

        public UserCollectionController(AppDbContext context, IImageService imageService, ICollectionReportService reportService)
        {
            _context = context;
            _imageService = imageService;
            _reportService = reportService;
        }

        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportToPdf()
        {
            var items = await _context.UserCollection
                .Include(uc => uc.Game)
                .OrderByDescending(uc => uc.AddedDate)
                .ToListAsync();

            var pdfBytes = _reportService.GenerateCollectionPdf(items);
            return File(pdfBytes, "application/pdf", $"CollectGames_Collection_{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserCollectionItem>>> GetCollection()
        {
            return await _context.UserCollection
                .Include(uc => uc.Game)
                .OrderByDescending(uc => uc.AddedDate)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<UserCollectionItem>> AddItem([FromForm] UserCollectionCreateDto dto)
        {
            var game = await _context.Games
                .FirstOrDefaultAsync(g => g.Title == dto.Title && g.Platform == dto.Platform);

            if (game == null)
            {
                game = new Game
                {
                    Title = dto.Title,
                    Platform = dto.Platform,
                    NormalizedTitle = dto.Title.ToUpperInvariant()
                };
                _context.Games.Add(game);
                await _context.SaveChangesAsync();
            }

            string? imagePath = null;
            if (dto.Image != null)
            {
                try
                {
                    imagePath = await _imageService.SaveImageAsync(dto.Image);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Image upload failed: {ex.Message}");
                }
            }

            var newItem = new UserCollectionItem
            {
                GameId = game.Id,
                Condition = dto.Condition ?? "Loose",
                PricePaid = dto.PricePaid,
                PurchaseDate = dto.PurchaseDate ?? DateTime.UtcNow,
                Notes = dto.Notes,
                UserImagePath = imagePath,
                AddedDate = DateTime.UtcNow
            };

            _context.UserCollection.Add(newItem);
            await _context.SaveChangesAsync();

            newItem.Game = game;

            return CreatedAtAction(nameof(GetCollection), new { id = newItem.Id }, newItem);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserCollectionItem>> UpdateItem(int id, [FromForm] UserCollectionUpdateDto dto)
        {
            var item = await _context.UserCollection
                .Include(u => u.Game)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (item == null)
                return NotFound();

            // Update fields
            item.Condition = dto.Condition ?? item.Condition;
            item.PricePaid = dto.PricePaid ?? item.PricePaid;
            item.PurchaseDate = dto.PurchaseDate ?? item.PurchaseDate;
            item.Notes = dto.Notes ?? item.Notes;

            // Handle image update if provided
            if (dto.Image != null)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(item.UserImagePath))
                {
                    try
                    {
                        await _imageService.DeleteImageAsync(item.UserImagePath);
                    }
                    catch { /* Ignore if file doesn't exist */ }
                }

                // Save new image
                try
                {
                    item.UserImagePath = await _imageService.SaveImageAsync(dto.Image);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Image upload failed: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.UserCollection
                .Include(u => u.Game)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (item == null)
                return NotFound();

            // Delete image file if exists
            if (!string.IsNullOrEmpty(item.UserImagePath))
            {
                try
                {
                    await _imageService.DeleteImageAsync(item.UserImagePath);
                }
                catch { /* Ignore if file doesn't exist */ }
            }

            _context.UserCollection.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

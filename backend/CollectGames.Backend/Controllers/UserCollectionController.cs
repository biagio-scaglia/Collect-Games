using CollectGames.Backend.Data;
using CollectGames.Backend.Dtos;
using CollectGames.Backend.Models;
using CollectGames.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mapster;
using Polly;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace CollectGames.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCollectionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IImageService _imageService;
        private readonly ICollectionReportService _reportService;
        private readonly ILogger<UserCollectionController> _logger;
        private readonly IDistributedCache _cache;

        public UserCollectionController(
            AppDbContext context, 
            IImageService imageService, 
            ICollectionReportService reportService,
            ILogger<UserCollectionController> logger,
            IDistributedCache cache)
        {
            _context = context;
            _imageService = imageService;
            _reportService = reportService;
            _logger = logger;
            _cache = cache;
        }

        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportToPdf()
        {
            _logger.LogInformation("Exporting collection to PDF");
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
            string cacheKey = "user_collection";
            try 
            {
                var cachedData = await _cache.GetStringAsync(cacheKey);
                if (!string.IsNullOrEmpty(cachedData))
                {
                    _logger.LogInformation("Returning collection from cache");
                    return JsonSerializer.Deserialize<List<UserCollectionItem>>(cachedData)!;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis cache error, falling back to database");
            }

            var items = await _context.UserCollection
                .Include(uc => uc.Game)
                .OrderByDescending(uc => uc.AddedDate)
                .ToListAsync();

            try 
            {
                var options = new DistributedCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(items), options);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to update Redis cache");
            }

            return items;
        }

        [HttpPost]
        public async Task<ActionResult<UserCollectionItem>> AddItem([FromForm] UserCollectionCreateDto dto)
        {
            var retryPolicy = Policy.Handle<DbUpdateException>().WaitAndRetryAsync(3, i => TimeSpan.FromSeconds(i));

            return await retryPolicy.ExecuteAsync(async () => {
                var game = await _context.Games
                    .FirstOrDefaultAsync(g => g.Title == dto.Title && g.Platform == dto.Platform);

                if (game == null)
                {
                    game = dto.Adapt<Game>();
                    game.NormalizedTitle = dto.Title.ToUpperInvariant();
                    _context.Games.Add(game);
                    await _context.SaveChangesAsync();
                }

                string? imagePath = null;
                if (dto.Image != null)
                {
                    imagePath = await _imageService.SaveImageAsync(dto.Image);
                }

                var newItem = dto.Adapt<UserCollectionItem>();
                newItem.GameId = game.Id;
                newItem.UserImagePath = imagePath;
                newItem.AddedDate = DateTime.UtcNow;

                _context.UserCollection.Add(newItem);
                await _context.SaveChangesAsync();
                newItem.Game = game;

                await _cache.RemoveAsync("user_collection");
                _logger.LogInformation("Added new game to collection: {Title}", game.Title);
                return CreatedAtAction(nameof(GetCollection), new { id = newItem.Id }, newItem);
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserCollectionItem>> UpdateItem(int id, [FromForm] UserCollectionUpdateDto dto)
        {
            var item = await _context.UserCollection
                .Include(uc => uc.Game)
                .FirstOrDefaultAsync(uc => uc.Id == id);

            if (item == null) return NotFound();

            // Update item with Mapster
            dto.Adapt(item);

            if (dto.Image != null)
            {
                if (!string.IsNullOrEmpty(item.UserImagePath))
                {
                    await _imageService.DeleteImageAsync(item.UserImagePath);
                }
                item.UserImagePath = await _imageService.SaveImageAsync(dto.Image);
            }

            await _context.SaveChangesAsync();
            await _cache.RemoveAsync("user_collection");

            _logger.LogInformation("Updated item {Id} in collection", id);
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.UserCollection.FindAsync(id);
            if (item == null) return NotFound();

            if (!string.IsNullOrEmpty(item.UserImagePath))
            {
                await _imageService.DeleteImageAsync(item.UserImagePath);
            }

            _context.UserCollection.Remove(item);
            await _context.SaveChangesAsync();
            await _cache.RemoveAsync("user_collection");

            _logger.LogInformation("Deleted item {Id} from collection", id);
            return NoContent();
        }
    }
}

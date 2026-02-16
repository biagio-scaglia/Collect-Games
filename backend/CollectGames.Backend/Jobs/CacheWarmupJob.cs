using Hangfire;
using Microsoft.Extensions.Caching.Distributed;

namespace CollectGames.Backend.Jobs;

public class CacheWarmupJob
{
    private readonly ILogger<CacheWarmupJob> _logger;
    private readonly IDistributedCache _cache;

    public CacheWarmupJob(ILogger<CacheWarmupJob> logger, IDistributedCache cache)
    {
        _logger = logger;
        _cache = cache;
    }

    public async Task Execute()
    {
        _logger.LogInformation("Starting cache warmup job");

        try
        {
            // Warm up the collection cache
            await _cache.RemoveAsync("user_collection");
            _logger.LogInformation("Cache warmup completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Cache warmup job failed");
        }
    }
}

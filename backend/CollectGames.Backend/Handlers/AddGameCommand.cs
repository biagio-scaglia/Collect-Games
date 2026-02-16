using CollectGames.Backend.Data;
using CollectGames.Backend.Models;
using CollectGames.Backend.Dtos;
using MediatR;
using Mapster;
using System.Threading;

namespace CollectGames.Backend.Handlers;

public record AddGameCommand(UserCollectionCreateDto Dto, IFormFile? Image) : IRequest<UserCollectionItem>;

public class AddGameCommandHandler : IRequestHandler<AddGameCommand, UserCollectionItem>
{
    private readonly AppDbContext _context;
    private readonly Services.IImageService _imageService;
    private readonly ILogger<AddGameCommandHandler> _logger;

    public AddGameCommandHandler(
        AppDbContext context,
        Services.IImageService imageService,
        ILogger<AddGameCommandHandler> logger)
    {
        _context = context;
        _imageService = imageService;
        _logger = logger;
    }

    public async Task<UserCollectionItem> Handle(AddGameCommand request, CancellationToken cancellationToken)
    {
        var game = await _context.Games
            .FirstOrDefaultAsync(g => g.Title == request.Dto.Title && g.Platform == request.Dto.Platform, cancellationToken);

        if (game == null)
        {
            game = new Game
            {
                Title = request.Dto.Title,
                Platform = request.Dto.Platform,
                NormalizedTitle = request.Dto.Title.ToUpperInvariant()
            };
            _context.Games.Add(game);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var item = request.Dto.Adapt<UserCollectionItem>();
        item.GameId = game.Id;
        item.AddedDate = DateTime.UtcNow;

        if (request.Image != null)
        {
            item.UserImagePath = await _imageService.SaveImageAsync(request.Image);
        }

        _context.UserCollection.Add(item);
        await _context.SaveChangesAsync(cancellationToken);

        item.Game = game;
        _logger.LogInformation("Added game {Title} to collection", game.Title);

        return item;
    }
}

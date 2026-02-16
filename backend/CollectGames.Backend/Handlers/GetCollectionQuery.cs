using CollectGames.Backend.Data;
using CollectGames.Backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace CollectGames.Backend.Handlers;

public record GetCollectionQuery : IRequest<List<UserCollectionItem>>;

public class GetCollectionQueryHandler : IRequestHandler<GetCollectionQuery, List<UserCollectionItem>>
{
    private readonly AppDbContext _context;

    public GetCollectionQueryHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserCollectionItem>> Handle(GetCollectionQuery request, CancellationToken cancellationToken)
    {
        return await _context.UserCollection
            .Include(uc => uc.Game)
            .OrderByDescending(uc => uc.AddedDate)
            .ToListAsync(cancellationToken);
    }
}

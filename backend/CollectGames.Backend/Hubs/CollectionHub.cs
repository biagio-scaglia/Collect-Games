using Microsoft.AspNetCore.SignalR;

namespace CollectGames.Backend.Hubs;

public class CollectionHub : Hub
{
    public async Task NotifyCollectionUpdated()
    {
        await Clients.All.SendAsync("CollectionUpdated");
    }

    public async Task NotifyGameAdded(string gameTitle)
    {
        await Clients.All.SendAsync("GameAdded", gameTitle);
    }

    public async Task NotifyGameRemoved(string gameTitle)
    {
        await Clients.All.SendAsync("GameRemoved", gameTitle);
    }
}

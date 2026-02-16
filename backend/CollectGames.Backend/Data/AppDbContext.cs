using CollectGames.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CollectGames.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<UserCollectionItem> UserCollection { get; set; }
        public DbSet<Models.Console> Consoles { get; set; }
        public DbSet<WishlistItem> Wishlist { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure UserCollectionItem relationship
            modelBuilder.Entity<UserCollectionItem>()
                .HasOne(u => u.Game)
                .WithMany()
                .HasForeignKey(u => u.GameId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Review relationship
            modelBuilder.Entity<Review>()
                .HasOne(r => r.UserCollectionItem)
                .WithMany()
                .HasForeignKey(r => r.UserCollectionItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure one review per collection item
            modelBuilder.Entity<Review>()
                .HasIndex(r => r.UserCollectionItemId)
                .IsUnique();
        }
    }
}


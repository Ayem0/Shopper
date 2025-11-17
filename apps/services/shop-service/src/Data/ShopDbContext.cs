using Microsoft.EntityFrameworkCore;
using ShopifyClone.Cs.Shared.src.Core.Models;
using Models;

namespace Data;

public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {
    }

    public DbSet<Shop> Shop { get; set; }
    public DbSet<OutboxMessage> OutboxMessage { get; set; }
    public DbSet<ShopUser> ShopUser { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfiguration(new OutboxMessageConfiguration());
        builder.ApplyConfiguration(new ShopConfiguration());
        builder.ApplyConfiguration(new ShopUserConfiguration());
    }
}

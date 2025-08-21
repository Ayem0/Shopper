using System;
using Microsoft.EntityFrameworkCore;
using ShopifyClone.Cs.Shared.src.Core.Models;
using ShopifyClone.Services.ShopService.src.Models;

namespace ShopifyClone.Services.ShopService.src.Data;

public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {
    }

    public DbSet<Shop> Shop { get; set; }
    public DbSet<OutboxMessage> OutboxMessage { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<OutboxMessage>(entity =>
        {
            entity.Property(e => e.Timestamp)
                .HasColumnType("timestamptz") // PostgreSQL timestamp with timezone
                .IsRequired();
        });
    }
}

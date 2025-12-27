using System;
using Microsoft.EntityFrameworkCore;
using Models;
using ShopifyClone.Cs.Shared.src.Core.Models;

namespace Data;

public class ProductDbContext : DbContext
{
    public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<VariantOption> VariantOptions { get; set; }
    public DbSet<VariantOptionValue> VariantOptionValues { get; set; }
    public DbSet<OutboxMessage> OutboxMessage { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }

}

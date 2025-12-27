using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Data;

public class ShopDbContextFactory : IDesignTimeDbContextFactory<ShopDbContext>
{
    public ShopDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ShopDbContext>();

        // Use the same connection string you'd normally inject from environment
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5434;Database=shop-db;Username=root;Password=root"
        );

        return new ShopDbContext(optionsBuilder.Options);
    }
}

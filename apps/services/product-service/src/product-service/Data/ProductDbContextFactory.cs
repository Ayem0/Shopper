using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Data;

public class ProductDbContextFactory : IDesignTimeDbContextFactory<ProductDbContext>
{
    public ProductDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ProductDbContext>();

        // Use the same connection string you'd normally inject from environment
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5433;Database=product-db;Username=root;Password=root"
        );

        return new ProductDbContext(optionsBuilder.Options);
    }
}

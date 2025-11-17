using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Models;

namespace Data;

public class ShopConfiguration : IEntityTypeConfiguration<Shop>
{
    public void Configure(EntityTypeBuilder<Shop> builder)
    {
        // for filtering and ordering by updatedAt
        builder.HasIndex(x => new { x.IsActive, x.Type, x.UpdatedAt, x.Id })
            .IncludeProperties(x => x.Name)
            .IsUnique(false);
        // for filtering and ordering by name
        builder.HasIndex(x => new { x.IsActive, x.Type, x.Name, x.Id })
            .IncludeProperties(x => x.UpdatedAt)
            .IsUnique(false);
        // builder.HasIndex(x => x.Name).HasMethod("GIN").IsTsVectorExpressionIndex("english");
        // for name search
        builder.HasIndex(x => x.Name).HasMethod("GIN").HasOperators("gin_trgm_ops");
    }
}

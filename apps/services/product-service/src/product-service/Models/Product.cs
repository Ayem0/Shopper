using ShopifyClone.ProtoCs.Common.Types;

namespace Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public ActiveStatus Status { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public List<ProductCategory> Categories { get; set; } = [];
    public List<ProductVariant> ProductVariants { get; set; } = [];
}

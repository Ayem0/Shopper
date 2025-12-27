using ShopifyClone.ProtoCs.Common.Types;

namespace Models;

public class ProductCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public ActiveStatus Status { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ProductCategory? ParentCategory { get; set; }
    public List<Product> Products { get; set; } = [];
    public Guid? ParentCategoryId { get; set; }
}

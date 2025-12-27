using System;
using ShopifyClone.ProtoCs.Common.Types;

namespace Models;

public class ProductVariant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public Guid ProductId { get; set; }
    public ActiveStatus Status { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public required Product Product { get; set; }
    public List<VariantOptionValue> VariantOptionValues { get; set; } = [];
}

using System;

namespace Models;

public class VariantOptionValue
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public string Value { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public required VariantOption VariantOption { get; set; }
    public Guid VariantOptionId { get; set; }
    public List<ProductVariant> ProductVariants { get; set; } = [];
}

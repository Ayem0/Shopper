using System;
using ShopifyClone.ProtoCs.Common.Types;

namespace product_service.DTO;

public class ProductDTO
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public ActiveStatus Status { get; set; }
    public required string Name { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<ProductCategoryDTO>? Categories { get; set; }
    public List<ProductVariantDTO>? ProductVariants { get; set; }
}



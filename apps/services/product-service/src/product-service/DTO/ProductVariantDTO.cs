using System;
using ShopifyClone.ProtoCs.Common.Types;

namespace product_service.DTO;

public class ProductVariantDTO
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public required ProductDTO Product { get; set; }
    public ActiveStatus Status { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<VariantOptionValueDTO> VariantOptionValues { get; set; } = [];
}

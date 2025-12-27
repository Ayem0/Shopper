using System;

namespace product_service.DTO;

public class VariantOptionDTO
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

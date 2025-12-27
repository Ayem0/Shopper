using System;

namespace product_service.DTO;

public class VariantOptionValueDTO
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public required string Value { get; set; }
    public required string OptionName { get; set; }
}

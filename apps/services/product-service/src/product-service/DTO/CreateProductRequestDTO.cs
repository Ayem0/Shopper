using System;
using ShopifyClone.ProtoCs.Common.Types;

namespace product_service.DTO;

public class CreateProductRequestDTO
{
    public string Name { get; set; } = string.Empty;
    public string ShopId { get; set; } = string.Empty;
    public string? Descr { get; set; }
    public List<string> CategoryIds { get; set; } = [];
    public ActiveStatus Status { get; set; }
    public List<VariantOptionDto> VariantOptions { get; set; } = [];
}

public class VariantOptionDto
{
    public string Name { get; set; } = string.Empty;
    public List<string> Values { get; set; } = [];
}
using System;
using Models;
using ShopifyClone.ProtoCs.Common.Types;

namespace product_service.DTO;

public class ProductCategoryDTO
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public ActiveStatus Status { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
    public ProductCategoryDTO? ParentCategory { get; set; }
    public Guid? ParentCategoryId { get; set; }
}

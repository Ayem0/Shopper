using System;
using ShopifyClone.Cs.ProtoCs.Shop.Types;

namespace DTO;

public class ShopDataDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public bool IsActive { get; set; }
    public ShopType Type { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

using ShopifyClone.Cs.ProtoCs.Shop.Types;

namespace Models;

public class ShopUser
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public ShopUserType ShopUserType { get; set; } = ShopUserType.Owner;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Guid ShopId { get; set; }
    public required Shop Shop { get; set; }
}
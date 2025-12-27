using ShopifyClone.ProtoCs.Shop.Types;

namespace Models;

public class ShopUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public required ShopUserType ShopUserType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Guid ShopId { get; set; }
    public required Shop Shop { get; set; }
}
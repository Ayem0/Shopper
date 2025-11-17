using ShopifyClone.Cs.ProtoCs.Common.Types;
using ShopifyClone.Cs.ProtoCs.Shop.Types;

namespace Models;

public class Shop
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = false;
    public ShopType Type { get; set; } = ShopType.Unspecified;
    public CreationStatus DnsCreationStatus { get; set; } = CreationStatus.NotStarted;
    public CreationStatus AuthClientCreationStatus { get; set; } = CreationStatus.NotStarted;
    public CreationStatus ConfigurationCreationStatus { get; set; } = CreationStatus.NotStarted;
    public SubscriptionStatus SubscriptionStatus { get; set; } = SubscriptionStatus.Inactive;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ActivatedAt { get; set; }
    public DateTime? LastActivedAt { get; set; }
    public List<ShopUser> ShopUsers = [];
}

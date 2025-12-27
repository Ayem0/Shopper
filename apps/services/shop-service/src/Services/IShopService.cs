
using ShopifyClone.ProtoCs.Shop.Types;

namespace Services;

public interface IShopService
{
    public Task<CreateShopResponse> CreateAsync(CreateShopRequest req, Guid userId);
    public Task<GetShopsResponse> GetShops(GetShopsRequest req, Guid userId);
    public Task<GetShopMemberResponse> GetShopMember(GetShopMemberRequest req);
}

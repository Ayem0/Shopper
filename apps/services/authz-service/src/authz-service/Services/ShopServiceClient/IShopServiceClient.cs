using authz_service.Models;

namespace authz_service.Services.ShopServiceClient;

public interface IShopServiceClient
{
    public Task<Authz?> GetShopMember(string shopId, string userId);
}

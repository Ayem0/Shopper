
using ShopifyClone.Cs.ProtoCs.Shop.Types;

namespace ShopifyClone.Services.ShopService.src.Services.Interfaces;

public interface IShopService {
    public Task<CreateShopResponse> CreateAsync(CreateShopRequest req, string userId);
}

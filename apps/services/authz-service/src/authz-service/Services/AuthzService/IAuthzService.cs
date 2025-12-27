using System;
using ShopifyClone.ProtoCs.Authz.Types;
using ShopifyClone.ProtoCs.Shop.Events;
using ShopifyClone.ProtoCs.Shop.Types;

namespace authz_service.Services.AuthzService;

public interface IAuthzService
{
    public Task ConsumeShopMemberEvent(ShopMemberEvent evt);
    public Task<AuthorizeResponse> Authorize(string shopId, string userId, ShopUserType? type);
}

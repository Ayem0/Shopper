using System;
using ShopifyClone.Cs.ProtoCs.Shop.Events;

namespace shop_configuration_service.src.Services;

public interface IShopConfigurationService
{
    public Task ConsumeShopCreated(ShopCreated evt);
    public Task HandleConsumeShopCreatedFailure(ShopCreated evt, Exception exp);
}

using System;
using ShopifyClone.ProtoCs.Shop.Events;

namespace shop_configuration_service.Services;

public interface IShopConfigurationService
{
    public Task ConsumeShopEvent(ShopEvent evt);
    public Task HandleConsumeShopCreatedFailure(ShopCreated evt, Exception exp);
}

using System;
using ShopifyClone.ProtoCs.Shop.Events;
using ShopifyClone.ProtoCs.Theme.Types;

namespace theme_service.Services.ThemeService;

public interface IThemeService
{
    public Task CreateDefaultThemeAsync(string shopId);
    public Task ConsumeShopEvent(ShopEvent evt);
    public Task<UpdateThemeResponse> UpdateThemeAsync(UpdateThemeRequest req);
}

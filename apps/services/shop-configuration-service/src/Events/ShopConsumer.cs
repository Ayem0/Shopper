using shop_configuration_service.src.Services;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using ShopifyClone.Cs.Shared.src.Infra.Messaging.Interfaces;

namespace shop_configuration_service.src.Events;

public class ShopConsumer : IConsumer<ShopEvent>
{
    private readonly ILogger<ShopConsumer> _logger;
    private readonly IShopConfigurationService _shopConfigurationService;
    public ShopConsumer(ILogger<ShopConsumer> logger, IShopConfigurationService shopConfigurationService)
    {
        _logger = logger;
        _shopConfigurationService = shopConfigurationService;
    }

    public Task ConsumeAsync(ShopEvent evt, CancellationToken cancellationToken)
    {
        return evt.OneofTypeCase switch
        {
            ShopEvent.OneofTypeOneofCase.Created => _shopConfigurationService.ConsumeShopCreated(evt.Created, cancellationToken),
            _ => Task.CompletedTask,
        };
    }

    public Task HandleFailureAsync(ShopEvent evt, Exception ex)
    {
        return evt.OneofTypeCase switch
        {
            ShopEvent.OneofTypeOneofCase.Created => _shopConfigurationService.HandleConsumeShopCreatedFailure(evt.Created, ex),
            _ => Task.CompletedTask,
        };
    }
}

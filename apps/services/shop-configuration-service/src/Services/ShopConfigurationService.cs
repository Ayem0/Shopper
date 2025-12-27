using Microsoft.Extensions.Logging;
using ShopifyClone.ProtoCs.Shop.Events;

namespace shop_configuration_service.Services;

public class ShopConfigurationService : IShopConfigurationService
{
    private readonly ILogger<ShopConfigurationService> _logger;
    public ShopConfigurationService(ILogger<ShopConfigurationService> logger)
    {
        _logger = logger;
    }

    public async Task ConsumeShopEvent(ShopEvent evt)
        => await (evt.OneofTypeCase switch
        {
            ShopEvent.OneofTypeOneofCase.Created => ConsumeShopCreated(evt.Created),
            _ => Task.CompletedTask,
        });

    private Task ConsumeShopCreated(ShopCreated evt)
    {
        try
        {
            _logger.LogInformation("Received event with id : {id}, type : {type} ", evt.ShopId, evt.ShopType);
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while handling event {evt}", evt);
            return Task.FromException(ex);
        }
    }

    public Task HandleConsumeShopCreatedFailure(ShopCreated evt, Exception exp)
    {
        try
        {
            _logger.LogInformation("HANDLING ShopCreated failure : {evt} {ex}", evt, exp);
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while handling event {evt}", evt);
            return Task.FromException(ex);
        }
    }
}

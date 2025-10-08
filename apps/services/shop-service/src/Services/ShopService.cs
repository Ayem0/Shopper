using Google.Protobuf;
using Microsoft.Extensions.Logging;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using ShopifyClone.Cs.ProtoCs.Shop.Types;
using ShopifyClone.Cs.Shared.src.Core.Models;
using ShopifyClone.Services.ShopService.src.Data;
using ShopifyClone.Services.ShopService.src.Models;

namespace ShopifyClone.Services.ShopService.src.Services;

public class ShopService : IShopService
{
    private readonly ShopDbContext _dbContext;
    private readonly ILogger<ShopService> _logger;
    public ShopService(
        ShopDbContext dbContext,
        ILogger<ShopService> logger
    )
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public async Task<CreateShopResponse> CreateAsync(CreateShopRequest req, string userId)
    {
        _logger.LogInformation("REQUEST NAME : {name}, DOMAIN-NAME: {domainName} TYPE: {type}", req.Name, req.SubdomainName, req.Type);
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var shop = new Shop()
            {
                Id = Guid.NewGuid(),
                OwnerUserId = userId,
                Name = req.Name,
                SubdomainName = req.SubdomainName,
                Type = req.Type
            };
            var payload = new ShopEvent()
            {
                Created = new ShopCreated()
                {
                    ShopId = shop.Id.ToString(),
                    ShopType = shop.Type
                }
            };
            var topic = nameof(ShopEvent);


            var test = payload.ToByteArray();

            try
            {
                var obj = ShopEvent.Parser.ParseFrom(test);
                _logger.LogInformation("WORKING");
            }
            catch (System.Exception)
            {
                _logger.LogInformation("NOT WORKING");
            }

            var msg = new OutboxMessage()
            {
                Id = Guid.NewGuid(),
                EventType = nameof(ShopCreated),
                AggregateId = shop.Id.ToString(),
                AggregateType = topic,
                Payload = test,
                Timestamp = DateTime.UtcNow
            };
            _dbContext.Shop.Add(shop);
            _dbContext.OutboxMessage.Add(msg);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
            return new CreateShopResponse
            {
                ShopId = shop.Id.ToString()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating shop : {message}, {data}", ex.Message, ex.Data);
            await transaction.RollbackAsync();
            throw;
        }
    }
}

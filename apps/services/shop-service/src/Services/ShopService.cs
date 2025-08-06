using Google.Protobuf;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using ShopifyClone.Cs.ProtoCs.Shop.Types;
using ShopifyClone.Cs.Shared.src.Core.Models;
using ShopifyClone.Services.ShopService.src.Data;
using ShopifyClone.Services.ShopService.src.Models;
using ShopifyClone.Services.ShopService.src.Services.Interfaces;

namespace ShopifyClone.Services.ShopService.src.Services;

public class ShopService : IShopService
{
    private readonly ShopDbContext _context;
    private readonly ILogger<ShopService> _logger;
    public ShopService(ShopDbContext context, ILogger<ShopService> logger)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<CreateShopResponse> CreateAsync(CreateShopRequest req, string userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var shop = new Shop()
            {
                Id = Guid.CreateVersion7(),
                OwnerUserId = userId,
                Name = req.Name,
                SubdomainName = req.SubdomainName,
                Type = req.Type
            };
            var payload = new ShopCreatedEvent()
            {
                ShopId = shop.Id.ToString(),
                ShopType = shop.Type
            };
            var msg = new OutboxMessage()
            {
                Id = Guid.CreateVersion7(),
                Type = nameof(ShopCreatedEvent),
                AggregateId = shop.Id.ToString(),
                AggregateType = nameof(Shop),
                Payload = payload.ToByteArray(),
                Timestamp = DateTimeOffset.UtcNow
            };
            await _context.Shop.AddAsync(shop);
            await _context.OutboxMessage.AddAsync(msg);
            await _context.SaveChangesAsync();
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

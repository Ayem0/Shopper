using Confluent.Kafka;
using Confluent.Kafka.SyncOverAsync;
using Confluent.SchemaRegistry;
using Confluent.SchemaRegistry.Serdes;
using Google.Protobuf;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using ShopifyClone.Cs.ProtoCs.Shop.Types;
using ShopifyClone.Cs.Shared.src.Core.Models;
using ShopifyClone.Services.ShopService.src.Data;
using ShopifyClone.Services.ShopService.src.Models;
using ShopifyClone.Services.ShopService.src.Services.Interfaces;

namespace ShopifyClone.Services.ShopService.src.Services;

public class ShopService : IShopService {
    private readonly ShopDbContext _dbContext;
    private readonly ILogger<ShopService> _logger;
    private readonly ProtobufSerializer<ShopEvent> _protobufSerializer;
    public ShopService(ShopDbContext dbContext, ILogger<ShopService> logger, ISchemaRegistryClient schemaRegistryClient) {
        _logger = logger;
        _dbContext = dbContext;
        // Configure ProtobufSerializer with auto-registration enabled
        var serializerConfig = new ProtobufSerializerConfig {
            AutoRegisterSchemas = true
        };
        _protobufSerializer = new ProtobufSerializer<ShopEvent>(schemaRegistryClient, serializerConfig);
    }

    public async Task<CreateShopResponse> CreateAsync(CreateShopRequest req, string userId) {
        _logger.LogInformation("REQUEST NAME : {name}, DOMAIN-NAME: {domainName} TYPE: {type}", req.Name, req.SubdomainName, req.Type);
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try {
            var shop = new Shop() {
                Id = Guid.CreateVersion7(),
                OwnerUserId = userId,
                Name = req.Name,
                SubdomainName = req.SubdomainName,
                Type = req.Type
            };
            var payload = new ShopEvent() {
                Created = new ShopCreated() {
                    ShopId = shop.Id.ToString(),
                    ShopType = shop.Type
                }
            };
            var topic = nameof(ShopEvent);
            var serializedPayload = await _protobufSerializer.SerializeAsync(payload, new SerializationContext(MessageComponentType.Value, topic));
            var msg = new OutboxMessage() {
                Id = Guid.CreateVersion7(),
                EventType = nameof(ShopCreated),
                AggregateId = shop.Id.ToString(),
                AggregateType = topic,
                Payload = serializedPayload,
                Timestamp = DateTime.UtcNow
            };
            _dbContext.Shop.Add(shop);
            _dbContext.OutboxMessage.Add(msg);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
            return new CreateShopResponse {
                ShopId = shop.Id.ToString()
            };
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Error creating shop : {message}, {data}", ex.Message, ex.Data);
            await transaction.RollbackAsync();
            throw;
        }
    }
}

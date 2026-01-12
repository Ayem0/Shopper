using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using Google.Protobuf;
using Microsoft.Extensions.Logging;
using ShopifyClone.ProtoCs.Shop.Events;
using ShopifyClone.ProtoCs.Theme.Events;
using ShopifyClone.ProtoCs.Theme.Types;
using theme_service.Models;
using theme_service.Services.ThemeRepository;

namespace theme_service.Services.ThemeService;

public class ThemeService : IThemeService
{
    private readonly IThemeRepository _repository;
    private readonly IAmazonDynamoDB _dynamoDb;
    private readonly IDynamoDBContext _context;
    private readonly ILogger _logger;
    private const string _topic = nameof(ThemeEvent);
    public ThemeService(
        IThemeRepository repository,
        IAmazonDynamoDB dynamoDb,
        IDynamoDBContext context,
        ILogger<ThemeService> logger)
    {
        _repository = repository;
        _dynamoDb = dynamoDb;
        _context = context;
        _logger = logger;
    }
    public async Task CreateDefaultThemeAsync(string shopId)
    {
        try
        {
            var defaults = "some strings";
            var theme = new Theme
            {
                ShopId = shopId,
                Styles = defaults
            };
            var evt = new ThemeEvent
            {
                Created = new ThemeCreated
                {
                    ShopId = shopId,
                }
            };
            var msg = new OutboxMessage
            {
                AggregateId = shopId,
                AggregateType = _topic,
                EventType = nameof(ThemeCreated),
                Payload = evt.ToByteArray(),
                Timestamp = DateTime.UtcNow
            };

            var request = new TransactWriteItemsRequest
            {
                TransactItems =
                    [
                        new()
                        {
                            Put = new Put
                            {
                                TableName = "Theme",
                                Item = _context.ToDocument(theme).ToAttributeMap(),
                                ConditionExpression = "attribute_not_exists(ShopId)"
                            }
                        },
                        new()
                        {
                            Put = new Put
                            {
                                TableName = "OutboxMessage",
                                Item = _context.ToDocument(msg).ToAttributeMap()
                            }
                        }
                    ]
            };

            var res = await _dynamoDb.TransactWriteItemsAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating default theme for shopId : '{}'", shopId);
            throw;
        }
    }

    public async Task ConsumeShopEvent(ShopEvent evt)
     => await (evt.OneofTypeCase switch
     {
         ShopEvent.OneofTypeOneofCase.Created => CreateDefaultThemeAsync(evt.Created.ShopId),
         _ => Task.CompletedTask,
     });

    public async Task<UpdateThemeResponse> UpdateThemeAsync(UpdateThemeRequest req)
    {
        try
        {
            var theme = await _repository.GetAsync(req.ShopId) ?? throw new Exception("No theme found");
            theme.Styles = req.Styles;
            await _repository.CreateOrUpdateAsync(theme);
            return new UpdateThemeResponse
            {
                Styles = req.Styles
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating theme for shopId : '{}'", req.ShopId);
            throw;
        }
    }
}

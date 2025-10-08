using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using shop_configuration_service.src.Services;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using AWS.Lambda.Powertools.Kafka.Protobuf;

[assembly: LambdaSerializer(typeof(PowertoolsKafkaProtobufSerializer))]

namespace shop_configuration_service;

public class KafkaConsumers
{
    private readonly IShopConfigurationService _shopConfigurationService;
    public KafkaConsumers(IShopConfigurationService shopConfigurationService)
    {
        _shopConfigurationService = shopConfigurationService;
    }

    [LambdaFunction()]
    public async Task ConsumeShopEvents(ConsumerRecords<string, ShopEvent> records)
    {
        Console.WriteLine($"RECEIVED : {records.Count()} RECORDS");
        foreach (var record in records)
        {
            Console.WriteLine($"record {record.Topic}");
            var evt = record.Value;
            await (evt.OneofTypeCase switch
            {
                ShopEvent.OneofTypeOneofCase.Created => _shopConfigurationService.ConsumeShopCreated(evt.Created),
                _ => Task.CompletedTask,
            });
        }
    }
}
// [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
// [LambdaFunction()]
// public Task ConsumeShopEvents(ShopEvent evt)
// {
//     Console.WriteLine($"Received event of type : {evt.OneofTypeCase}");
//     return evt.OneofTypeCase switch
//     {
//         ShopEvent.OneofTypeOneofCase.Created => _shopConfigurationService.ConsumeShopCreated(evt.Created),
//         _ => Task.CompletedTask,
//     };
// }

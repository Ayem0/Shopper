using Amazon.Lambda.Annotations;
using Amazon.Lambda.Core;
using authz_service.Services.AuthzService;
using AWS.Lambda.Powertools.Kafka.Protobuf;
using ShopifyClone.ProtoCs.Shop.Events;

// [assembly: ]

namespace authz_service;

public class Consumers
{
    private readonly IAuthzService _service;
    public Consumers(IAuthzService service)
    {
        _service = service;
    }

    [LambdaSerializer(typeof(PowertoolsKafkaProtobufSerializer))]
    [LambdaFunction()]
    public async Task ConsumeShopMemberEvents(ConsumerRecords<string, ShopMemberEvent> records)
    {
        Console.WriteLine($"RECEIVED : {records.Count()} RECORDS");
        foreach (var record in records)
        {
            Console.WriteLine($"record {record.Topic}");
            var evt = record.Value;
            await _service.ConsumeShopMemberEvent(evt);
        }
    }
}

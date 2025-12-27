using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using Services.KeycloakService;
using AWS.Lambda.Powertools.Kafka.Protobuf;

[assembly: LambdaSerializer(typeof(PowertoolsKafkaProtobufSerializer))]

namespace identity_service;

public class KafkaConsumers
{
    private readonly IKeycloakService _keycloakService;
    public KafkaConsumers(IKeycloakService keycloakService)
    {
        _keycloakService = keycloakService;
    }

    [LambdaFunction()]
    public async Task AddClient(ConsumerRecords<string, string> records, ILambdaContext context)
    {
        foreach (var record in records)
        {
            await _keycloakService.AddClient(record.Value);
        }
    }
}
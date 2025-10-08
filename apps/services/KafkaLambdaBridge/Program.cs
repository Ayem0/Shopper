using System.Text;
using System.Text.Json;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using Confluent.Kafka;
using ShopifyClone.Cs.ProtoCs.Shop.Events;

Console.WriteLine("Starting KafkaLambaBridge...");

Dictionary<string, string[]> topicLambdaMap = new()
{
    [nameof(ShopEvent)] = ["shop-configuration-service-consume-shop-events"]
};

var consumerConfig = new ConsumerConfig()
{
    BootstrapServers = "kafka:9092",
    GroupId = "kafka-lambda-bridge",
    AutoOffsetReset = AutoOffsetReset.Latest
};
using var consumer = new ConsumerBuilder<string, byte[]>(consumerConfig).Build();
consumer.Subscribe(topicLambdaMap.Keys);

using var lambdaClient = new AmazonLambdaClient(
    new Amazon.Runtime.BasicAWSCredentials("test", "test"),
    new AmazonLambdaConfig
    {
        ServiceURL = "http://localstack:4566",
        AuthenticationRegion = "us-east-1"
    }
);
try
{
    while (true)
    {

        var consumeResult = consumer.Consume();
        var topic = consumeResult.Topic;
        try
        {
            var shopEvent = ShopEvent.Parser.ParseFrom(consumeResult.Message.Value);
            Console.WriteLine($"Parsing worked: {shopEvent}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"PARSING DIDNT WORK: {ex.Message}");
        }


        var fakeRecord = new KafkaLambdaBridge.ConsumerRecord<string, object>()
        {
            Topic = topic,
            Partition = consumeResult.Partition.Value,
            Offset = consumeResult.Offset.Value,
            Timestamp = consumeResult.Message.Timestamp.UnixTimestampMs,
            TimestampType = consumeResult.Message.Timestamp.Type.ToString(),
            Key = Convert.ToBase64String(Encoding.UTF8.GetBytes(consumeResult.Message.Key)),
            Value = Convert.ToBase64String(consumeResult.Message.Value),
            Headers = [],
            KeySchemaMetadata = new()
            {
                DataFormat = "STRING"
            },
            ValueSchemaMetadata = new()
            {
                DataFormat = "PROTOBUF"
            }
        };
        var fakeRecords = new KafkaLambdaBridge.ConsumerRecords<string, object>()
        {
            EventSource = "aws:kafka",
            EventSourceArn = "arn:aws:kafka:local:123456789:cluster/fake",
            BootstrapServers = consumerConfig.BootstrapServers,
            Records = new()
            {
                [topic] = [fakeRecord]
            }
        };

        var jsonPayload = JsonSerializer.Serialize(new
        {
            fakeRecords.EventSource,
            fakeRecords.EventSourceArn,
            fakeRecords.BootstrapServers,
            fakeRecords.Records
        }, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
        Console.WriteLine(jsonPayload);
        foreach (var lambda in topicLambdaMap[topic])
        {
            try
            {
                var request = new InvokeRequest
                {
                    FunctionName = lambda,
                    Payload = jsonPayload
                };

                var response = await lambdaClient.InvokeAsync(request);
                Console.WriteLine($"✅ Invoked {lambda}, status: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error invoking {lambda}: {ex.Message}");
            }
        }
    }
}
catch (ConsumeException e)
{
    Console.WriteLine($"⚠️ Kafka consume error: {e.Error.Reason}");
}

public class DebeziumOutboxEnvelope
{
    public string Id { get; set; }
    public string AggregateType { get; set; }
    public string AggregateId { get; set; }
    public byte[] Payload { get; set; }
}
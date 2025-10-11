using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using Confluent.Kafka;

Console.WriteLine("Starting KafkaLambaBridge...");
var configPath = "config.json";
var topicLambdaMap = new ConcurrentDictionary<string, string[]>();
var configLock = new object();
var consumerConfig = new ConsumerConfig()
{
    BootstrapServers = "kafka:9092",
    GroupId = "kafka-lambda-bridge",
    AutoOffsetReset = AutoOffsetReset.Latest
};
using var consumer = new ConsumerBuilder<string, byte[]>(consumerConfig).Build();
using var lambdaClient = new AmazonLambdaClient(
    new Amazon.Runtime.BasicAWSCredentials("test", "test"),
    new AmazonLambdaConfig
    {
        ServiceURL = "http://localstack:4566",
        AuthenticationRegion = "us-east-1"
    }
);
var watcher = new FileSystemWatcher(".", configPath)
{
    NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size
};
watcher.Changed += (s, e) =>
{
    // Delay a little so file writes complete
    Task.Delay(500).ContinueWith(async _ => await LoadConfig());
};
watcher.EnableRaisingEvents = true;

await LoadConfig();
Consume();
await Loop();
async Task LoadConfig()
{
    try
    {
        var cfgStr = await File.ReadAllTextAsync(configPath);
        var cfg = JsonSerializer.Deserialize<Dictionary<string, string[]>>(cfgStr);
        if (cfg == null)
        {
            Console.WriteLine("CONFIG IS NULL");
            return;
        }
        lock (configLock)
        {
            topicLambdaMap.Clear();
            foreach (var kv in cfg)
                topicLambdaMap[kv.Key] = kv.Value;
        }
        Console.WriteLine($"🔄 Config reloaded: {string.Join(", ", topicLambdaMap.Keys)}");
        Consume();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"CONFIG LOADING FAILED : {ex.Message}");
    }
}
void Consume()
{
    lock (configLock)
    {
        consumer.Unsubscribe();
        consumer.Subscribe(topicLambdaMap.Keys);
        Console.WriteLine($"Consume started: {string.Join(", ", topicLambdaMap.Keys)}");
    }
}
async Task Loop()
{
    var jsonOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
    while (true)
    {
        try
        {
            var consumeResult = consumer.Consume();
            var topic = consumeResult.Topic;
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
            }, jsonOptions);
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
        catch (ConsumeException e)
        {
            Console.WriteLine($"⚠️ Kafka consume error: {e.Error.Reason}");
        }
    }
}


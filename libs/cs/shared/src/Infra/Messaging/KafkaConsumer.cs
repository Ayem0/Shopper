using System;
using Confluent.Kafka;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Shared.Services.Kafka;

/// <summary>
/// Implements IKafkaConsumer using Confluent.Kafka to consume messages from Kafka topics.
/// </summary>
public sealed class KafkaConsumer : IKafkaConsumer, IDisposable
{
    private readonly ILogger<KafkaConsumer> _logger;
    private readonly IConsumer<Ignore, string> _consumer;
    private readonly KafkaConsumerSettings _settings;

    /// <summary>
    /// Initializes a new instance of the <see cref="KafkaConsumer"/> class.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    /// <param name="settings">The Kafka consumer settings from configuration.</param>
    public KafkaConsumer(ILogger<KafkaConsumer> logger, IOptions<KafkaConsumerSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;

        var config = new ConsumerConfig
        {
            BootstrapServers = _settings.BootstrapServers,
            GroupId = _settings.GroupId,
            AutoOffsetReset = AutoOffsetReset.Earliest, // Start from the beginning if no offset is committed
            EnableAutoCommit = false // We'll manually commit offsets for better control
        };

        _consumer = new ConsumerBuilder<Ignore, string>(config)
            .SetErrorHandler((_, e) => _logger.LogError("Kafka Consumer Error: {Error}", e.Reason))
            .SetLogHandler((_, logMessage) => _logger.LogInformation("Kafka Consumer Log: {LogSource} - {LogMessage}", logMessage.Name, logMessage.Message))
            .Build();

        _logger.LogInformation("Kafka Consumer initialized for GroupId: {GroupId}, BootstrapServers: {BootstrapServers}",
            _settings.GroupId, _settings.BootstrapServers);
    }

    /// <summary>
    /// Subscribes the consumer to the specified Kafka topics.
    /// </summary>
    /// <param name="topics">The list of topics to subscribe to.</param>
    public void Subscribe(IEnumerable<string> topics)
    {
        _consumer.Subscribe(topics);
        _logger.LogInformation("Subscribed to Kafka topics: {Topics}", string.Join(", ", topics));
    }

    /// <summary>
    /// Starts consuming messages from the configured Kafka topic(s).
    /// This method runs an infinite loop until the stopping token is cancelled.
    /// </summary>
    /// <param name="messageHandler">A callback function to process each consumed message value.</param>
    /// <param name="stoppingToken">A cancellation token to stop the consumption loop.</param>
    public async Task StartConsuming(Func<string, Task> messageHandler, CancellationToken stoppingToken)
    {
        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Consume a message with a timeout to allow for graceful shutdown
                    var consumeResult = _consumer.Consume(stoppingToken);

                    if (consumeResult != null)
                    {
                        _logger.LogInformation("Consumed message from topic {Topic} at offset {Offset}: {Message}",
                            consumeResult.TopicPartitionOffset, consumeResult.Offset, consumeResult.Message.Value);

                        // Invoke the provided message handler
                        await messageHandler(consumeResult.Message.Value);

                        // Manually commit the offset after successful processing
                        Commit(consumeResult);
                        _logger.LogInformation("Offset committed for message at offset {Offset}", consumeResult.Offset);
                    }
                }
                catch (ConsumeException ex)
                {
                    _logger.LogError(ex, "Kafka Consume Error on topic '{Topic}': {ErrorReason}", ex.ConsumerRecord?.Topic, ex.Error.Reason);
                    // Handle specific Kafka errors (e.g., rebalance, network issues)
                    // Depending on the error, you might want to pause, retry, or exit.
                    // A small delay might be beneficial here to prevent tight looping on persistent errors.
                    await Task.Delay(1000, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Expected when stoppingToken is cancelled, gracefully exit loop
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An unexpected error occurred during Kafka consumption.");
                    // Consider a small delay here to prevent rapid error looping
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
        finally
        {
            _consumer.Close(); // Ensure consumer is closed when the service stops
            _logger.LogInformation("Kafka consumer closed.");
        }
    }

    /// <summary>
    /// Commits the offset of a consumed message.
    /// </summary>
    /// <param name="consumeResult">The result of the consume operation.</param>
    public void Commit(ConsumeResult<Ignore, string> consumeResult)
    {
        try
        {
            _consumer.Commit(consumeResult);
        }
        catch (KafkaException ex)
        {
            _logger.LogError(ex, "Failed to commit offset for message at offset {Offset}. Error: {ErrorReason}", consumeResult.Offset, ex.Error.Reason);
        }
    }

    /// <summary>
    /// Disposes the Kafka consumer.
    /// </summary>
    public void Dispose()
    {
        _consumer.Dispose();
        _logger.LogInformation("Kafka Consumer disposed.");
    }
}

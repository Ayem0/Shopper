using ShopifyClone.Cs.Shared.src.Infra.Messaging.Interfaces;
using Confluent.Kafka;
using Google.Protobuf;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace ShopifyClone.Cs.Shared.src.Infra.Messaging.Services;

internal class KafkaConsumerBackgroundService<TConsumer, TEvent> : BackgroundService
    where TConsumer : IConsumer<TEvent>
    where TEvent : class, IMessage<TEvent>, new() {
    private readonly ILogger<KafkaConsumerBackgroundService<TConsumer, TEvent>> _logger;
    private readonly IConsumer<string, TEvent> _consumer;
    private readonly IServiceProvider _serviceProvider;

    public KafkaConsumerBackgroundService(
      ILogger<KafkaConsumerBackgroundService<TConsumer, TEvent>> logger,
      IServiceProvider serviceProvider,
      IConsumer<string, TEvent> consumer
    ) {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _consumer = consumer;
        _consumer.Subscribe(typeof(TEvent).Name);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        try {
            while (!stoppingToken.IsCancellationRequested) {
                using var scope = _serviceProvider.CreateScope();
                var internalConsumer = scope.ServiceProvider.GetRequiredService<IConsumer<TEvent>>();
                try {
                    var consumeResult = _consumer.Consume(stoppingToken);
                    if (consumeResult != null) {
                        _logger.LogInformation("Consumed message from topic {Topic} at offset {Offset} with key: {key} with message : {Message}",
                            consumeResult.TopicPartitionOffset, consumeResult.Offset, consumeResult.Message.Key, consumeResult.Message.Value);
                        await internalConsumer.ConsumeAsync(consumeResult.Message.Value, stoppingToken);
                        _consumer.Commit(consumeResult);
                        _logger.LogInformation("Offset committed for message at offset {Offset}", consumeResult.Offset);
                    }
                }
                catch (OperationCanceledException) {
                    break;
                }
                catch (ConsumeException ex) {
                    _logger.LogError(ex, "Kafka Consume Error on topic '{Topic}': {ErrorReason}", ex.ConsumerRecord?.Topic, ex.Error.Reason);
                    // TODO introduce dlq
                    await Task.Delay(1000, stoppingToken);
                }
                catch (Exception ex) {
                    _logger.LogError(ex, "An unexpected error occurred during Kafka consumption.");
                    // TODO introduce retries with dlq
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
        finally {
            _consumer.Close();
            _logger.LogInformation("Kafka consumer closed.");
        }
    }
}
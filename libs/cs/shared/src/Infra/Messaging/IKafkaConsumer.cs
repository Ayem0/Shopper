using System;
using Confluent.Kafka;

namespace Shared.Services.Kafka;

public interface IKafkaConsumer
{
    /// <summary>
    /// Starts consuming messages from the configured Kafka topic(s).
    /// </summary>
    /// <param name="messageHandler">A callback function to process each consumed message value.</param>
    /// <param name="stoppingToken">A cancellation token to stop the consumption loop.</param>
    Task StartConsuming(Func<string, Task> messageHandler, CancellationToken stoppingToken);

    /// <summary>
    /// Subscribes the consumer to the specified Kafka topics.
    /// </summary>
    /// <param name="topics">The list of topics to subscribe to.</param>
    void Subscribe(IEnumerable<string> topics);

    /// <summary>
    /// Commits the offset of a consumed message.
    /// </summary>
    /// <param name="consumeResult">The result of the consume operation.</param>
    void Commit(ConsumeResult<Ignore, string> consumeResult);
}
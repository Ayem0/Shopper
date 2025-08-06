using System;
using System.ComponentModel.DataAnnotations;

namespace Shared.Services.Kafka;

public class KafkaConsumerSettings
{
    /// <summary>
    /// Gets or sets the comma-separated list of Kafka broker addresses (e.g., "kafka:9092").
    /// </summary>
    [Required]
    public string BootstrapServers { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the consumer group ID.
    /// </summary>
    [Required]
    public string GroupId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Kafka topic(s) to subscribe to (comma-separated if multiple).
    /// This can be a single topic or a comma-separated list of topics.
    /// </summary>
    [Required]
    public string TopicNames { get; set; } = string.Empty; // Renamed to TopicNames to indicate it can be multiple
}

using System;

namespace KafkaLambdaBridge;

public class ConsumerRecord<TK, T>
{
    //
    // Summary:
    //     Gets or sets the Kafka topic name from which the record was consumed.
    public string Topic { get; internal set; }

    //
    // Summary:
    //     Gets the Kafka partition from which the record was consumed.
    public int Partition { get; internal set; }

    //
    // Summary:
    //     Gets the offset of the record within its Kafka partition.
    public long Offset { get; internal set; }

    //
    // Summary:
    //     Gets the timestamp of the record (typically in Unix time).
    public long Timestamp { get; internal set; }

    //
    // Summary:
    //     Gets the type of timestamp (e.g., "CREATE_TIME" or "LOG_APPEND_TIME").
    public string TimestampType { get; internal set; }

    //
    // Summary:
    //     Gets the key of the record (often used for partitioning).
    public TK Key { get; internal set; }

    //
    // Summary:
    //     Gets the deserialized value of the record.
    public T Value { get; internal set; }

    //
    // Summary:
    //     Gets the headers associated with the record.
    public Dictionary<string, byte[]> Headers { get; internal set; }

    //
    // Summary:
    //     Gets the schema metadata for the record's value.
    public SchemaMetadata ValueSchemaMetadata { get; internal set; }

    //
    // Summary:
    //     Gets the schema metadata for the record's key.
    public SchemaMetadata KeySchemaMetadata { get; internal set; }
}
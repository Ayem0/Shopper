using System;

namespace KafkaLambdaBridge;

public class SchemaMetadata
{
    //
    // Summary:
    //     Gets or sets the format of the data (e.g., "JSON", "AVRO" "Protobuf"). ///
    public string DataFormat { get; internal set; }

    //
    // Summary:
    //     Gets or sets the schema ID associated with the record's value or key.
    public string SchemaId { get; internal set; }
}

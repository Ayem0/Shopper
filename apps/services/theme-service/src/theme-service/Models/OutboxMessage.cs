using System;
using Amazon.DynamoDBv2.DataModel;

namespace theme_service.Models;



[DynamoDBTable("OutboxMessage")]
public class OutboxMessage
{
    // Event id 
    public Guid Id { get; } = Guid.NewGuid();
    // Topic type = protobuf message type
    public required string AggregateType { get; set; }
    // entity id
    public required string AggregateId { get; set; }
    // topic event type = protobuf message oneof message
    public required string EventType { get; set; }
    public required DateTime Timestamp { get; set; }
    // topic payload protobuf binary[]
    public required byte[] Payload { get; set; }
}
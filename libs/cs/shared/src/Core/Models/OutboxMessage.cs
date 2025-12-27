namespace ShopifyClone.Cs.Shared.src.Core.Models;

/// <summary>
/// OutboxMessage for kafka event with protobuf
/// Ex: 
/// message ShopEvent {
///   oneof oneof_type {
///     ShopCreated created = 1;
///     ShopUpdated updated = 2;
///   }
/// }
/// public class OutboxMessage
/// {
///    public Guid Id { get; set; } = Guid.NewGuid();
///    public string AggregateType { get; set; } = nameof(ShopEvent);
///    public string AggregateId { get; set; } = ShopId;
///    public string EventType { get; set; } = nameof(ShopCreated) or nameof(shopUpdated);
///    public DateTime Timestamp { get; set; } = DateTime.UtcNow();
///    public byte[] Payload { get; set; } = shopEvent.ToByteArray();
/// }
/// 
/// </summary>
public class OutboxMessage
{
    // Event id 
    public Guid Id { get; set; } = Guid.NewGuid();
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

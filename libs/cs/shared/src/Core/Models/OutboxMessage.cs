namespace ShopifyClone.Cs.Shared.src.Core.Models;

public class OutboxMessage {
    // Event id 
    public Guid Id { get; set; }
    // Topic type
    public string AggregateType { get; set; } = string.Empty;
    // entity id
    public string AggregateId { get; set; } = string.Empty;
    // topic event type
    public string EventType { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    // topic payload protobuf
    public byte[] Payload { get; set; } = [];
}

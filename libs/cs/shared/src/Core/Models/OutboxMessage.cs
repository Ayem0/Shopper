using System;

namespace ShopifyClone.Cs.Shared.src.Core.Models;

public class OutboxMessage
{
    public Guid Id { get; set; }
    public string AggregateType { get; set; } = string.Empty;
    public string AggregateId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTimeOffset Timestamp { get; set; }
    public byte[] Payload { get; set; } = [];
}

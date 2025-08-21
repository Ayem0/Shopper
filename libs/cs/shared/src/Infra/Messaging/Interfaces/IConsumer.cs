using Google.Protobuf;

namespace ShopifyClone.Cs.Shared.src.Infra.Messaging.Interfaces;

public interface IConsumer<TEvent> where TEvent : IMessage<TEvent>, new()
{
    public Task ConsumeAsync(TEvent evt, CancellationToken cancellationToken);
    public Task HandleFailureAsync(TEvent evt, Exception ex);
}

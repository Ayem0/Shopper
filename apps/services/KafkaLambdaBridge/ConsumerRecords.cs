
using System.Collections;
namespace KafkaLambdaBridge;

public class ConsumerRecords<TK, T> : IEnumerable<ConsumerRecord<TK, T>>, IEnumerable
{
    //
    // Summary:
    //     Gets the event source (typically "aws:kafka").
    public string EventSource { get; internal set; }

    //
    // Summary:
    //     Gets the ARN of the event source (MSK cluster or Self-managed Kafka).
    public string EventSourceArn { get; internal set; }

    //
    // Summary:
    //     Gets the Kafka bootstrap servers connection string.
    public string BootstrapServers { get; internal set; }

    internal Dictionary<string, List<ConsumerRecord<TK, T>>> Records { get; set; } = new Dictionary<string, List<ConsumerRecord<TK, T>>>();

    //
    // Summary:
    //     Returns an enumerator that iterates through all consumer records across all topics.
    //
    //
    // Returns:
    //     An enumerator of ConsumerRecord<T> objects.
    public IEnumerator<ConsumerRecord<TK, T>> GetEnumerator()
    {
        foreach (KeyValuePair<string, List<ConsumerRecord<TK, T>>> record in Records)
        {
            foreach (ConsumerRecord<TK, T> item in record.Value)
            {
                yield return item;
            }
        }
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}

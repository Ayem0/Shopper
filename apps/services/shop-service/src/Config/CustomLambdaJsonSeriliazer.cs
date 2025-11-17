using System.Collections.Concurrent;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Amazon.Lambda.Serialization.SystemTextJson;
using Google.Protobuf;
using Google.Protobuf.Reflection;
using ShopifyClone.Cs.ProtoCs.Shop.Events;

namespace ShopifyClone.Services.ShopService.src.Config;

public class CustomLambdaJsonSerializer : DefaultLambdaJsonSerializer
{
    public CustomLambdaJsonSerializer() : base(options =>
    {
        // 👇 This is the key line
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    })
    {
    }
    private static readonly JsonParser _protoParser = new(JsonParser.Settings.Default.WithIgnoreUnknownFields(true));
    private static readonly ConcurrentDictionary<Type, MessageDescriptor> _descriptorCache = new();
    protected override T InternalDeserialize<T>(byte[] utf8Json)
    {
        // if the type to deseriliaze in is a protobuf IMessage<T> use protobuf JsonParser
        if (typeof(IMessage).IsAssignableFrom(typeof(T)))
        {
            string json = Encoding.UTF8.GetString(utf8Json);

            // Create a dummy instance to let JsonParser infer the type at runtime
            if (Activator.CreateInstance(typeof(T)) is not IMessage instance)
                throw new InvalidOperationException($"Type {typeof(T)} does not implement IMessage or lacks a public constructor.");

            var message = _protoParser.Parse(json, instance.Descriptor);
            return (T)message;
        }
        return base.InternalDeserialize<T>(utf8Json);
    }

    protected override void InternalSerialize<T>(Utf8JsonWriter writer, T response)
    {
        base.InternalSerialize(writer, response);
    }


    private T InternalDeserializeUsingReflectionWithCache<T>(byte[] utf8Json)
    {
        if (typeof(IMessage).IsAssignableFrom(typeof(T)))
        {
            // We use reflection to get the 'Descriptor' property which provides metadata.
            var descriptor = _descriptorCache.GetOrAdd(typeof(T), t =>
            {
                var prop = t.GetProperty("Descriptor", BindingFlags.Public | BindingFlags.Static)!;
                return (MessageDescriptor)prop.GetValue(null)!;
            });
            string json = Encoding.UTF8.GetString(utf8Json);
            return (T)_protoParser.Parse(json, descriptor);
        }
        return base.InternalDeserialize<T>(utf8Json);
    }

    private T InternalDeserializeUsingReflection<T>(byte[] utf8Json)
    {
        if (typeof(IMessage).IsAssignableFrom(typeof(T)))
        {
            // We use reflection to get the 'Descriptor' property which provides metadata.

            var prop = typeof(T).GetProperty("Descriptor", BindingFlags.Public | BindingFlags.Static)!;
            var descriptor = (MessageDescriptor)prop.GetValue(null)!;
            string json = Encoding.UTF8.GetString(utf8Json);
            return (T)_protoParser.Parse(json, descriptor);
        }
        return base.InternalDeserialize<T>(utf8Json);
    }

    public T DeserializeUsingReflectionWithCache<T>(byte[] utf8Json)
    {
        return InternalDeserializeUsingReflectionWithCache<T>(utf8Json);
    }

    public T DeserializeUsingReflection<T>(byte[] utf8Json)
    {
        return InternalDeserializeUsingReflection<T>(utf8Json);
    }

    public T DeserializeUsingCreateInstance<T>(byte[] utf8Json)
    {
        return InternalDeserialize<T>(utf8Json);
    }

    public T DeserializeUsingAlreadyKnow<T>(byte[] utf8Json)
    {
        if (typeof(ShopEvent).IsAssignableTo(typeof(T)))
        {
            string json = Encoding.UTF8.GetString(utf8Json);
            return (T)(object)_protoParser.Parse<ShopEvent>(json);
        }
        return base.InternalDeserialize<T>(utf8Json);
    }
}

// public class CustomLambdaJsonSerializer : DefaultLambdaJsonSerializer
// {
//     private static readonly JsonParser _protoParser = new(JsonParser.Settings.Default.WithIgnoreUnknownFields(true));
//     protected override T InternalDeserialize<T>(byte[] utf8Json)
//     {
//         // if the type to deseriliaze in is a protobuf IMessage<T> use protobuf JsonParser
//         if (typeof(IMessage).IsAssignableFrom(typeof(T)))
//         {
//             // We use reflection to get the 'Descriptor' property which provides metadata.
//             var descriptorProperty = typeof(T).GetProperty("Descriptor", BindingFlags.Public | BindingFlags.Static)
//                 ?? throw new InvalidOperationException($"The type {typeof(T).FullName} implements IMessage but does not have the required static 'Descriptor' property.");
//             var descriptor = (MessageDescriptor)descriptorProperty.GetValue(null)!;
//             string json = Encoding.UTF8.GetString(utf8Json);
//             return (T)_protoParser.Parse(json, descriptor);
//         }
//         return base.InternalDeserialize<T>(utf8Json);
//     }
// }




// using Confluent.Kafka;
// using Confluent.Kafka.SyncOverAsync;
// using Confluent.SchemaRegistry;
// using Confluent.SchemaRegistry.Serdes;
// using Google.Protobuf;
// using Microsoft.Extensions.DependencyInjection;
// using ShopifyClone.Cs.Shared.src.Infra.Messaging.Interfaces;

// namespace ShopifyClone.Cs.Shared.src.Infra.Messaging.Services;

// public static class KafkaConsumerServiceCollectionExtensions {
//     public static IServiceCollection AddKafkaConsumer<TConsumer, TEvent>(this IServiceCollection services)
//         where TConsumer : class, IConsumer<TEvent>
//         where TEvent : class, IMessage<TEvent>, new() {
//         services.AddSingleton(sp => {
//             var schemaRegistry = sp.GetRequiredService<ISchemaRegistryClient>();
//             var consumerConfig = sp.GetRequiredService<ConsumerConfig>();

//             return new ConsumerBuilder<string, TEvent>(consumerConfig)
//                 .SetValueDeserializer(new ProtobufDeserializer<TEvent>(schemaRegistry).AsSyncOverAsync())
//                 .SetKeyDeserializer(Deserializers.Utf8)
//                 .Build();
//         });
//         services.AddScoped<IConsumer<TEvent>, TConsumer>();
//         services.AddHostedService<KafkaConsumerBackgroundService<TConsumer, TEvent>>();

//         return services;
//     }
//     // public static IServiceCollection AddSharedMessaging(this IServiceCollection services, Assembly assembly)
//     // {
//     //     // get all the classes that implements IEventHandler<T>
//     //     var consumers = assembly.GetTypes()
//     //         .Where(t => t.GetInterfaces()
//     //             .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IConsumer<>)));
//     //     foreach (var consumer in consumers)
//     //     {
//     //         var eventType = consumer.GetInterfaces()
//     //             .First(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IConsumer<>))
//     //             .GetGenericArguments()[0];
//     //         if (eventType != null)
//     //         {
//     //             var hostedServiceType = typeof(KafkaConsumerBackgroundService<,>).MakeGenericType(consumer, eventType);
//     //             services.AddScoped(typeof(IConsumer<>).MakeGenericType(eventType), consumer);
//     //             services.Add(ServiceDescriptor.Singleton(typeof(IHostedService), hostedServiceType));
//     //         }
//     //     }
//     //     return services;
//     // }
// }

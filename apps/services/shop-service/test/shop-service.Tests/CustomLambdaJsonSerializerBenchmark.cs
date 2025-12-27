
// using System.Diagnostics;
// using System.Text;
// using System.Text.Json;
// using Google.Protobuf;
// using ShopifyClone.ProtoCs.Shop.Events;
// using ShopifyClone.ProtoCs.Shop.Types;
// using Config;
// using Xunit;

// namespace ShopifyClone.Services.ShopService.Tests;

// public class CustomLambdaJsonSerializerBenchmark
// {
//     private readonly CustomLambdaJsonSerializer _customLambdaJsonSerializer;
//     public CustomLambdaJsonSerializerBenchmark()
//     {
//         _customLambdaJsonSerializer = new();
//     }
//     [Fact]
//     public void Run()
//     {
//         var protoMessage = new ShopEvent
//         {
//             Created = new ShopCreated
//             {
//                 ShopId = "5549c55e-a7f7-4c30-935a-22eeeef2264f",
//                 ShopType = ShopType.Fashion
//             }
//         };

//         string json = JsonSerializer.Serialize(protoMessage, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
//         byte[] utf8Json = Encoding.UTF8.GetBytes(json);
//         byte[] protoBinary = protoMessage.ToByteArray();
//         const int iterations = 10000;
//         Console.WriteLine($"Running {iterations:N0} deserializations per serializer...\n");

//         // Warm-up to avoid JIT skew
//         _customLambdaJsonSerializer.DeserializeUsingCreateInstance<ShopEvent>(utf8Json);
//         _customLambdaJsonSerializer.DeserializeUsingReflection<ShopEvent>(utf8Json);
//         _customLambdaJsonSerializer.DeserializeUsingReflectionWithCache<ShopEvent>(utf8Json);
//         _customLambdaJsonSerializer.DeserializeUsingAlreadyKnow<ShopEvent>(utf8Json);
//         // --- Activator version ---
//         var sw = Stopwatch.StartNew();
//         for (int i = 0; i < iterations; i++)
//             _customLambdaJsonSerializer.DeserializeUsingCreateInstance<ShopEvent>(utf8Json);
//         sw.Stop();
//         Console.WriteLine($"Activator: {sw.ElapsedMilliseconds} ms");

//         // --- Reflection version ---
//         sw.Restart();
//         for (int i = 0; i < iterations; i++)
//             _customLambdaJsonSerializer.DeserializeUsingReflection<ShopEvent>(utf8Json);
//         sw.Stop();
//         Console.WriteLine($"Reflection: {sw.ElapsedMilliseconds} ms");

//         // --- Reflection with cache version ---
//         sw.Restart();
//         for (int i = 0; i < iterations; i++)
//             _customLambdaJsonSerializer.DeserializeUsingReflectionWithCache<ShopEvent>(utf8Json);
//         sw.Stop();
//         Console.WriteLine($"Reflection with cache: {sw.ElapsedMilliseconds} ms");

//         // --- Already known version ---
//         sw.Restart();
//         for (int i = 0; i < iterations; i++)
//             _customLambdaJsonSerializer.DeserializeUsingAlreadyKnow<ShopEvent>(utf8Json);
//         sw.Stop();
//         Console.WriteLine($"Already known: {sw.ElapsedMilliseconds} ms");

//         // --- Proto binary version ---
//         sw.Restart();
//         for (int i = 0; i < iterations; i++)
//             ShopEvent.Parser.ParseFrom(protoBinary);
//         sw.Stop();
//         Console.WriteLine($"Proto binary: {sw.ElapsedMilliseconds} ms");
//     }
// }

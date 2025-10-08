using Microsoft.Extensions.DependencyInjection;
using ShopifyClone.Services.ShopService.src.Data;
using ShopifyClone.Services.ShopService.src.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Confluent.SchemaRegistry;
using Confluent.Kafka;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using Confluent.SchemaRegistry.Serdes;

namespace shop_service;

[Amazon.Lambda.Annotations.LambdaStartup]
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddLogging(builder =>
        {
            builder.AddLambdaLogger();
            builder.SetMinimumLevel(LogLevel.Debug);
        });

        services.AddDbContextPool<ShopDbContext>((sp, options) =>
        {
            options.UseNpgsql("Host=shop-service-database;Port=5432;Database=shop-database;Username=root;Password=root",
                opt => opt.SetPostgresVersion(17, 0)
            );
        });
        services.AddScoped<IShopService, ShopService>();
        // services.AddSingleton<ISchemaRegistryClient>(sp =>
        //     new CachedSchemaRegistryClient(new SchemaRegistryConfig
        //     {
        //         Url = "http://kafka-registry:8081"
        //     })
        // );
        // services.AddSingleton<IAsyncSerializer<ShopEvent>>(sp =>
        //     new ProtobufSerializer<ShopEvent>(sp.GetRequiredService<ISchemaRegistryClient>())
        // );
    }
}

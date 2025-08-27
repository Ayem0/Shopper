using Confluent.Kafka;
using Confluent.SchemaRegistry;
using Serilog.Events;
using shop_configuration_service.src.Events;
using shop_configuration_service.src.Services;
using ShopifyClone.Cs.ProtoCs.Shop.Events;
using ShopifyClone.Cs.Shared.src.Infra.Logging;
using ShopifyClone.Cs.Shared.src.Infra.Messaging.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSharedLogging(options => {
    options.ApplicationName = "shop-configuration-service";
    options.NodeUris = "https://es01:9200";
    options.IndexFormat = "shop-configuratin-service-{0:yyyy.MM.dd}";
    options.CertificateFilePath = "/app/certs/ca/ca.crt";
    options.AuthHeader = builder.Configuration["Elastic:Password"];
    options.MinimumLevel = LogEventLevel.Debug;
});
builder.Services.AddSingleton(new ConsumerConfig {
    BootstrapServers = "kafka:9092",
    GroupId = "shop-configuration-service",
    AutoOffsetReset = AutoOffsetReset.Earliest
});
builder.Services.AddSingleton(new ProducerConfig {

});
builder.Services.AddSingleton<ISchemaRegistryClient>(_ =>
  new CachedSchemaRegistryClient(new SchemaRegistryConfig {
      Url = "http://kafka-registry:8081"
  })
);
builder.Services.AddScoped<IShopConfigurationService, ShopConfigurationService>();
builder.Services.AddKafkaConsumer<ShopConsumer, ShopEvent>();


builder.WebHost.ConfigureKestrel(options => {
    options.ListenAnyIP(80); // Listen on container's HTTP port 80
    options.ListenAnyIP(443, listenOptions => // Listen on container's HTTPS port 443
    {
        listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1AndHttp2; // Required for gRPC
        var certificatePath = Path.Combine(builder.Environment.ContentRootPath, "certs", "aspnetapp.pfx"); // Your cert path

        if (!File.Exists(certificatePath)) {
            throw new FileNotFoundException($"Certificate file not found at {certificatePath}. Please ensure it's copied correctly and the path is accurate.");
        }

        // UseHttps with your certificate and password
        listenOptions.UseHttps(certificatePath, "MySuperSecretCertPassword123");
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

using ShopifyClone.Services.ShopService.src.Data;
using Microsoft.EntityFrameworkCore;
using ShopifyClone.Cs.Shared.src.Infra.Logging;
using Serilog.Events;
using ShopifyClone.Services.ShopService.src.Services.Interfaces;
using ShopifyClone.Services.ShopService.src.Services;
using Confluent.SchemaRegistry;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<ISchemaRegistryClient>(_ =>
    new CachedSchemaRegistryClient(new SchemaRegistryConfig {
        Url = "http://kafka-registry:8081"
    })
);

// Shared logging (elk stack)
builder.Services.AddSharedLogging(options => {
    options.ApplicationName = "shop-service";
    options.NodeUris = "https://es01:9200";
    options.IndexFormat = "shop-service-{0:yyyy.MM.dd}";
    options.CertificateFilePath = "/app/certs/ca/ca.crt";
    options.AuthHeader = builder.Configuration["Elastic:Password"];
    options.MinimumLevel = LogEventLevel.Debug;
});
// DB postgres
builder.Services.AddDbContextPool<ShopDbContext>((sp, options) => {
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database") ?? throw new Exception("NO ConnectionString:Database FOUND"),
        opt => opt
            .SetPostgresVersion(17, 0)
    );
});
builder.Services.AddScoped<IShopService, ShopService>();
// Configure Kestrel to listen on HTTP and HTTPS
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
builder.Services.AddCors(options => options.AddPolicy("Client",
    policy => policy.WithOrigins("http://localhost", "https://localhost")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
));
// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}
app.UseCors("Client");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

using ShopifyClone.Services.ShopService.src.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on HTTP and HTTPS
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80); // Listen on container's HTTP port 80
    options.ListenAnyIP(443, listenOptions => // Listen on container's HTTPS port 443
    {
        listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1AndHttp2; // Required for gRPC
        var certificatePath = Path.Combine(builder.Environment.ContentRootPath, "certs", "aspnetapp.pfx"); // Your cert path

        if (!File.Exists(certificatePath))
        {
            throw new FileNotFoundException($"Certificate file not found at {certificatePath}. Please ensure it's copied correctly and the path is accurate.");
        }

        // UseHttps with your certificate and password
        listenOptions.UseHttps(certificatePath, "MySuperSecretCertPassword123");
    });
});
// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
// DB
builder.Services.AddDbContextPool<ShopDbContext>((sp, options) =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database") ?? throw new Exception("NO ConnectionString:Database FOUND"),
        opt => opt
            .SetPostgresVersion(13, 0)
            .EnableRetryOnFailure(5)
    );
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

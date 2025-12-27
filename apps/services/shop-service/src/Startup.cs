using Microsoft.Extensions.DependencyInjection;
using Data;
using Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.Generated;

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
            options
                .UseModel(ShopDbContextModel.Instance)
                .UseNpgsql("Host=shop-service-db;Port=5432;Database=shop-db;Username=root;Password=root", opt => opt.SetPostgresVersion(17, 0)
            );
        });
        services.AddScoped<IShopService, ShopService>();
    }
}

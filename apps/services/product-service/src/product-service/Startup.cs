using Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ShopifyClone.Cs.Shared.src.Infra.Config;
using Services.ProductCategoryService;
using ShopifyClone.Cs.Shared.src.Infra.Auth;
using Microsoft.Extensions.Logging;
using ShopifyClone.Cs.Shared.src.Infra.EFCore;
using product_service.Infra;
using Services.ProductService;
using product_service.Utils;
namespace product_service;

[Amazon.Lambda.Annotations.LambdaStartup]
public class Startup
{
    /// <summary>
    /// Services for Lambda functions can be registered in the services dependency injection container in this method. 
    ///
    /// The services can be injected into the Lambda function through the containing type's constructor or as a
    /// parameter in the Lambda function using the FromService attribute. Services injected for the constructor have
    /// the lifetime of the Lambda compute container. Services injected as parameters are created within the scope
    /// of the function invocation.
    /// </summary>
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContextPool<ProductDbContext>((sp, options) =>
        {
            options
                // .UseModel(ProductDbContextModel.Instance)
                .UseNpgsql("Host=product-service-db;Port=5432;Database=product-db;Username=root;Password=root", opt => opt.SetPostgresVersion(17, 0)
            );
        });
        services.AddLogging(builder =>
        {
            builder.AddLambdaLogger();
            builder.SetMinimumLevel(LogLevel.Debug);
        });
        var builder = new ConfigurationBuilder().AddJsonFile("appsettings.json", true);
        var configuration = builder.Build();
        services.Configure<AuthzServiceConfig>(configuration.GetSection("AuthzService"));
        services.AddScoped<AuthzClient>();
        services.AddScoped<IProductCategoryService, ProductCategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddSingleton<IEFCoreQueryAdapter, EFCoreQueryAdapter>();
        services.AddHttpClient();
        services.AddAutoMapper(cfg => cfg.AddProfile(new AutoMapperProfile()));
    }
}

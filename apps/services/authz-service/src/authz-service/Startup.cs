using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using authz_service.Services.AuthzRepository;
using authz_service.Services.AuthzService;
using authz_service.Services.ShopServiceClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ShopifyClone.Cs.Shared.src.Infra.Config;

namespace authz_service;

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
        var builder = new ConfigurationBuilder().AddJsonFile("appsettings.json", true);
        var configuration = builder.Build();
        services.Configure<ShopServiceConfig>(configuration.GetSection("ShopService"));
        services.AddSingleton<IDynamoDBContext>(sp =>
        {
            // var client = sp.GetRequiredService<IAmazonDynamoDB>();
            return new DynamoDBContext(new AmazonDynamoDBClient(new BasicAWSCredentials("test", "test"), new AmazonDynamoDBConfig()
            {
                RegionEndpoint = RegionEndpoint.USEast1,
                UseHttp = true,
                ServiceURL = "http://host.docker.internal:4566",
            }), new DynamoDBContextConfig
            {

            });
        });
        services.AddHttpClient();
        services.AddScoped<IAuthzRepository, AuthzRepository>();
        services.AddScoped<IAuthzService, AuthzService>();
        services.AddScoped<IShopServiceClient, ShopServiceClient>();
    }
}

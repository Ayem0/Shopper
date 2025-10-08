using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using shop_configuration_service.src.Services;

namespace shop_configuration_service;

[Amazon.Lambda.Annotations.LambdaStartup]
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddLogging(builder =>
       {
           builder.AddLambdaLogger();
           builder.AddConsole();
           builder.SetMinimumLevel(LogLevel.Information);
       });
        services.AddScoped<IShopConfigurationService, ShopConfigurationService>();
    }
}
//// Example of creating the IConfiguration object and
//// adding it to the dependency injection container.
//var builder = new ConfigurationBuilder()
//                    .AddJsonFile("appsettings.json", true);

//// Add AWS Systems Manager as a potential provider for the configuration. This is 
//// available with the Amazon.Extensions.Configuration.SystemsManager NuGet package.
//builder.AddSystemsManager("/app/settings");

//var configuration = builder.Build();
//services.AddSingleton<IConfiguration>(configuration);

//// Example of using the AWSSDK.Extensions.NETCore.Setup NuGet package to add
//// the Amazon S3 service client to the dependency injection container.
//services.AddAWSService<Amazon.S3.IAmazonS3>();


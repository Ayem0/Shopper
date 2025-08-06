using System;
using System.Collections.Specialized;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Debugging;
using Serilog.Sinks.Elasticsearch;

namespace ShopifyClone.Cs.Shared.src.Infra.Logging;

public static class Logging
{
    /// <summary>
    /// Configures Serilog for logging to Console and Elasticsearch.
    /// Reads Elasticsearch configuration from the provided options.
    /// Enriches logs with machine name, process ID, thread ID, and a custom application name.
    /// </summary>
    /// <param name="services">The IServiceCollection to add Serilog to.</param>
    /// <param name="configuration">The IConfiguration instance to read general Serilog settings (like minimum level overrides) from.</param>
    /// <param name="configureOptions">An action to configure the ElasticLoggingOptions.</param>
    /// <returns>The modified IServiceCollection.</returns>
    public static IServiceCollection AddLogging(this IServiceCollection services, Action<LoggingOptions> configureOptions)
    {
        SelfLog.Enable(Console.Error);

        var options = new LoggingOptions();
        configureOptions(options); // Apply configuration provided by the caller

        var defaultAppName = "UnknownApplication";
        options.ApplicationName ??= defaultAppName; // Use null-coalescing assignment

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Is(options.MinimumLevel) // Set the base minimum level
            .Enrich.FromLogContext()
            .Enrich.WithMachineName() // Adds the machine name to logs
            .Enrich.WithProcessId() // Adds the process ID to logs
            .Enrich.WithThreadId() // Adds the thread ID to logs
            .Enrich.WithProperty("Application", options.ApplicationName)
            .WriteTo.Console() // Always write to console for local visibility
            .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(options.NodeUris))
            {
                AutoRegisterTemplate = true,
                AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv8,
                IndexFormat = options.IndexFormat,
                TypeName = "_doc", // For Elasticsearch 7+
                MinimumLogEventLevel = options.MinimumLevel, // Apply minimum level for this sink
                EmitEventFailure = EmitEventFailureHandling.WriteToSelfLog, // Log errors to Serilog's self-log
                BufferBaseFilename = "./logs/buffer", // Buffer logs to disk before sending
                BufferFileSizeLimitBytes = 5242880, // 5MB buffer file size
                BufferLogShippingInterval = TimeSpan.FromSeconds(5), // Ship buffered logs every 5 seconds
                QueueSizeLimit = 100000, // Max events in memory queue
                InlineFields = true, // Flatten properties into top-level fields
                NumberOfShards = 1,
                NumberOfReplicas = 0,
                ConnectionTimeout = TimeSpan.FromSeconds(5),
                ModifyConnectionSettings = c =>
                {
                    // Add Authorization header if provided
                    if (!string.IsNullOrEmpty(options.AuthHeader))
                    {
                        var base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes($"elastic:{options.AuthHeader}"));
                        var headers = new NameValueCollection
                        {
                            { "Authorization", $"Basic {base64}" }
                        };
                        c.GlobalHeaders(headers);
                    }
                    c.ServerCertificateValidationCallback(
                        (sender, certificate, chain, sslPolicyErrors) => true
                    );
                    return c;
                }
            })
            .CreateLogger();

        services.AddSingleton(Log.Logger);
        services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));

        return services;
    }
}
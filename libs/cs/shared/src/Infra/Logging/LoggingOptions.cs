using System;
using Serilog.Events;

namespace ShopifyClone.Cs.Shared.src.Infra.Logging;
/// <summary>
/// Options class to configure the Serilog Elasticsearch sink.
/// </summary>
public class LoggingOptions
{
    /// <summary>
    /// Gets or sets the URI(s) of the Elasticsearch node(s).
    /// Example: "https://es01:9200"
    /// </summary>
    public string NodeUris { get; set; } = "http://localhost:9200";

    /// <summary>
    /// Gets or sets the format string for the Elasticsearch index name.
    /// Example: "your-app-name-{0:yyyy.MM.dd}"
    /// </summary>
    public string IndexFormat { get; set; } = "logs-{0:yyyy.MM.dd}";

    /// <summary>
    /// Gets or sets the Base64 encoded authentication header (e.g., "elastic:password").
    /// This will be used as a Basic Authorization header.
    /// </summary>
    public string? AuthHeader { get; set; }

    /// <summary>
    /// Gets or sets the file path to the CA certificate for SSL/TLS verification.
    /// This certificate must be mounted into the Docker container.
    /// Example: "/usr/share/certs/ca/ca.crt"
    /// </summary>
    public string? CertificateFilePath { get; set; }

    /// <summary>
    /// Gets or sets the minimum log event level for the Elasticsearch sink.
    /// </summary>
    public LogEventLevel MinimumLevel { get; set; } = LogEventLevel.Information;

    /// <summary>
    /// Gets or sets the application name to enrich logs with.
    /// If not set, it will default to the entry assembly name.
    /// </summary>
    public string? ApplicationName { get; set; }
}

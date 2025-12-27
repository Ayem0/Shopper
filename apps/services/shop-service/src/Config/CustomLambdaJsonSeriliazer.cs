using System.Text.Json;
using Amazon.Lambda.Serialization.SystemTextJson;

namespace Config;

public class CustomLambdaJsonSerializer : DefaultLambdaJsonSerializer
{
    public CustomLambdaJsonSerializer() : base(options =>
    {
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.PropertyNameCaseInsensitive = true;
    })
    {
    }
}




using System;
using System.Text.Json;
using Amazon.Lambda.Serialization.SystemTextJson;

namespace ShopifyClone.Cs.Shared.src.Infra.AWS;

public class CustomLambdaJsonSerializer : DefaultLambdaJsonSerializer
{
    public CustomLambdaJsonSerializer() : base(options =>
        {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            options.PropertyNameCaseInsensitive = true;
        }
    )
    {
    }
}

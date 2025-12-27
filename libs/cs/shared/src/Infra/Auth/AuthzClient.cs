using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ShopifyClone.Cs.Shared.src.Infra.Config;
using ShopifyClone.ProtoCs.Authz.Types;

namespace ShopifyClone.Cs.Shared.src.Infra.Auth;

public class AuthzClient
{
    private readonly HttpClient _client;
    private readonly string _baseUrl;
    private readonly ILogger<AuthzClient> _logger;
    public AuthzClient(HttpClient client, IOptions<AuthzServiceConfig> config, ILogger<AuthzClient> logger)
    {
        _client = client;
        _baseUrl = config.Value.BaseUrl;
        _logger = logger;
    }

    public async Task<AuthorizeResponse> Authorize(AuthorizeRequest req)
    {
        _logger.LogDebug("AUTHORIZING WITH REQ: shopId: '{shopId}', shopId: '{userId}', type: '{type}'", req.ShopId, req.UserId, req.ShopUserType);
        var url = req.HasShopUserType
            ? $"{_baseUrl}/authorize?userId={req.UserId}&shopId={req.ShopId}&type={req.ShopUserType}"
            : $"{_baseUrl}/authorize?userId={req.UserId}&shopId={req.ShopId}";
        try
        {

            var res = await _client.GetAsync(url);
            var response = await JsonSerializer.DeserializeAsync<AuthorizeResponse>(res.Content.ReadAsStream());
            if (response == null)
                return new AuthorizeResponse
                {
                    IsAllowed = false
                };
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ERROR AUTHORIZING : {message}, {data}", ex.Message, ex.Data);
            return new AuthorizeResponse
            {
                IsAllowed = false
            };
        }
    }
}

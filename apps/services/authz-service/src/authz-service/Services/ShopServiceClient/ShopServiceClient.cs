using System.Text.Json;
using authz_service.Models;
using Microsoft.Extensions.Options;
using ShopifyClone.Cs.Shared.src.Infra.Config;
using ShopifyClone.ProtoCs.Shop.Types;

namespace authz_service.Services.ShopServiceClient;

public class ShopServiceClient : IShopServiceClient
{
    private readonly string _baseUrl;
    private readonly HttpClient _client;
    public ShopServiceClient(HttpClient client, IOptions<ShopServiceConfig> config)
    {
        _client = client;
        _baseUrl = config.Value.BaseUrl;
    }

    public async Task<Authz?> GetShopMember(string shopId, string userId)
    {
        var res = await _client.GetAsync($"{_baseUrl}/shops/{shopId}/member/{userId}");
        if (!res.IsSuccessStatusCode)
            return null;

        var row = await JsonSerializer.DeserializeAsync<GetShopMemberResponse>(res.Content.ReadAsStream());
        if (row?.ShopMember == null)
            return null;

        return new Authz
        {
            ShopId = row.ShopMember.ShopId,
            UserId = row.ShopMember.UserId,
            ShopUserType = row.ShopMember.ShopUserType
        };
    }


}

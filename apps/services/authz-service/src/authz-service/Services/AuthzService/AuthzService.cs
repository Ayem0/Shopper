using authz_service.Models;
using authz_service.Services.AuthzRepository;
using authz_service.Services.ShopServiceClient;
using Microsoft.Extensions.Logging;
using ShopifyClone.ProtoCs.Authz.Types;
using ShopifyClone.ProtoCs.Shop.Events;
using ShopifyClone.ProtoCs.Shop.Types;

namespace authz_service.Services.AuthzService;

public class AuthzService : IAuthzService
{
    private readonly IAuthzRepository _repo;
    private readonly IShopServiceClient _shopServiceClient;
    private readonly ILogger<AuthzService> _logger;
    public AuthzService(IAuthzRepository repo, IShopServiceClient shopServiceClient, ILogger<AuthzService> logger)
    {
        _repo = repo;
        _shopServiceClient = shopServiceClient;
        _logger = logger;
    }

    public async Task<AuthorizeResponse> Authorize(string shopId, string userId, ShopUserType? type)
    {
        _logger.LogInformation("AUTHORIZE WITH REQ : shopId: '{shopId}', userId: '{userId}', type: '{type}'", shopId, userId, type);
        var row = await GetShopMember(shopId, userId);

        if (row == null || type != null && row.ShopUserType != type)
        {
            _logger.LogInformation("NOT AUTHORIZED");
            return new AuthorizeResponse { IsAllowed = false };
        }

        _logger.LogInformation("AUTHORIZED");
        return new AuthorizeResponse { IsAllowed = true };
    }

    public async Task ConsumeShopMemberEvent(ShopMemberEvent evt)
        => await (evt.OneofTypeCase switch
        {
            ShopMemberEvent.OneofTypeOneofCase.Added => CreateShopMember(evt.Added),
            ShopMemberEvent.OneofTypeOneofCase.Updated => UpdateShopMember(evt.Updated),
            ShopMemberEvent.OneofTypeOneofCase.Deleted => DeleteShopMember(evt.Deleted),
            _ => Task.CompletedTask,
        });

    private Task CreateShopMember(ShopMemberAdded evt)
        => _repo.CreateOrUpdateAsync(new Authz { ShopId = evt.ShopId, UserId = evt.UserId, ShopUserType = evt.ShopUserType });

    private Task UpdateShopMember(ShopMemberUpdated evt)
        => _repo.CreateOrUpdateAsync(new Authz { ShopId = evt.ShopId, UserId = evt.UserId, ShopUserType = evt.ShopUserType });

    private Task DeleteShopMember(ShopMemberDeleted evt)
        => _repo.DeleteAsync(evt.ShopId, evt.UserId);

    private async Task<Authz?> GetShopMember(string shopId, string userId)
    {
        _logger.LogInformation("AUTHZ SERVICE : GET SHOP MEMBER");
        var item = await _repo.GetAsync(shopId, userId);
        item ??= await FetchShopMemberFallback(shopId, userId);
        return item;
    }

    private async Task<Authz?> FetchShopMemberFallback(string shopId, string userId)
    {
        _logger.LogInformation("AUTHZ SERVICE : FALLBACK");
        var row = await _shopServiceClient.GetShopMember(shopId, userId);
        if (row != null)
        {
            await _repo.CreateOrUpdateAsync(row);
        }
        return row;
    }


}

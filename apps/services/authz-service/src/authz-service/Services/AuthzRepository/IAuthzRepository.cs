using System;
using authz_service.Models;

namespace authz_service.Services.AuthzRepository;

public interface IAuthzRepository
{
    public Task CreateOrUpdateAsync(Authz row);
    public Task<Authz?> GetAsync(string shopId, string userId);
    public Task DeleteAsync(string shopId, string userId);
}

using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using authz_service.Models;

namespace authz_service.Services.AuthzRepository;

public class AuthzRepository : IAuthzRepository
{
    private readonly IDynamoDBContext _context;
    public AuthzRepository(IDynamoDBContext context)
    {
        _context = context;
    }

    public Task CreateOrUpdateAsync(Authz row)
        => _context.SaveAsync(row);

    public Task<Authz?> GetAsync(string shopId, string userId)
        => _context.LoadAsync<Authz?>(shopId, userId);

    public Task DeleteAsync(string shopId, string userId)
        => _context.DeleteAsync<Authz>(shopId, userId);
}

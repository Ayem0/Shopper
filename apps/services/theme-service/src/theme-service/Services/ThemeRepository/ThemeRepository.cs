using Amazon.DynamoDBv2.DataModel;
using theme_service.Models;

namespace theme_service.Services.ThemeRepository;

public class ThemeRepository : IThemeRepository
{
    private readonly IDynamoDBContext _context;
    public ThemeRepository(IDynamoDBContext context)
    {
        _context = context;
    }
    public Task CreateOrUpdateAsync(Theme row)
    => _context.SaveAsync(row);

    public Task DeleteAsync(string shopId)
        => _context.DeleteAsync<Theme>(shopId);

    public Task<Theme?> GetAsync(string shopId)
        => _context.LoadAsync<Theme?>(shopId);
}

using System;
using theme_service.Models;

namespace theme_service.Services.ThemeRepository;

public interface IThemeRepository
{
    public Task CreateOrUpdateAsync(Theme row);
    public Task<Theme?> GetAsync(string shopId);
    public Task DeleteAsync(string shopId);
}

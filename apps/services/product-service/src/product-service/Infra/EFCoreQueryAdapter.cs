using Microsoft.EntityFrameworkCore;
using ShopifyClone.Cs.Shared.src.Infra.EFCore;

namespace product_service.Infra;

public class EFCoreQueryAdapter : IEFCoreQueryAdapter
{
    public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken ct = default)
        => query.CountAsync(ct);

    public Task<T[]> ToArrayAsync<T>(IQueryable<T> query, CancellationToken ct = default)
        => query.ToArrayAsync(ct);
}
